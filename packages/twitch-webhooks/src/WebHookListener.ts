import type { LoggerOptions } from '@d-fischer/logger';
import { Logger } from '@d-fischer/logger';
import getRawBody from '@d-fischer/raw-body';
import type { Request, RequestHandler, Response } from 'httpanda';
import { Server } from 'httpanda';
import type {
	ApiClient,
	HelixBanEvent,
	HelixExtensionTransaction,
	HelixFollow,
	HelixModeratorEvent,
	HelixStream,
	HelixSubscriptionEvent,
	HelixUser,
	HypeTrainEvent,
	UserIdResolvable
} from 'twitch';
import { extractUserId } from 'twitch';
import type { ConnectionAdapter } from './Adapters/ConnectionAdapter';
import type { WebHookListenerConfig } from './Adapters/LegacyAdapter';
import { LegacyAdapter } from './Adapters/LegacyAdapter';
import type { ConnectCompatibleApp } from './ConnectCompatibleApp';
import { BanEventSubscription } from './Subscriptions/BanEventSubscription';
import { ExtensionTransactionSubscription } from './Subscriptions/ExtensionTransactionSubscription';
import { FollowsFromUserSubscription } from './Subscriptions/FollowsFromUserSubscription';
import { FollowsToUserSubscription } from './Subscriptions/FollowsToUserSubscription';
import { HypeTrainEventSubscription } from './Subscriptions/HypeTrainEventSubscription';
import { ModeratorEventSubscription } from './Subscriptions/ModeratorEventSubscription';
import { StreamChangeSubscription } from './Subscriptions/StreamChangeSubscription';
import type { Subscription } from './Subscriptions/Subscription';
import { SubscriptionEventSubscription } from './Subscriptions/SubscriptionEventSubscription';
import { UserChangeSubscription } from './Subscriptions/UserChangeSubscription';

/**
 * Certificate data used to make the listener server SSL capable.
 */
export interface WebHookListenerCertificateConfig {
	/**
	 * The private key of your SSL certificate.
	 */
	key: string;

	/**
	 * Your SSL certificate.
	 */
	cert: string;
}

/**
 * The configuration of a WebHook listener.
 */
export interface WebHookConfig {
	/**
	 * Default validity of a WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time.
	 * The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	hookValidity?: number;

	/**
	 * Options to pass to the logger.
	 */
	logger?: Partial<LoggerOptions>;
}

/**
 * A WebHook listener you can track changes in various channel and user data with.
 */
export class WebHookListener {
	private _server?: Server;
	private readonly _subscriptions = new Map<string, Subscription>();

	/** @private */ readonly _apiClient: ApiClient;
	private readonly _adapter: ConnectionAdapter;
	private readonly _logger: Logger;

	private readonly _hookValidity?: number;

	/**
	 * Creates a new WebHook listener.
	 *
	 * @deprecated Use the normal {@WebHookListener} constructor instead.
	 *
	 * @param apiClient The ApiClient instance to use for user info and API requests.
	 * @param config
	 */
	static async create(apiClient: ApiClient, config: WebHookListenerConfig = {}): Promise<WebHookListener> {
		const adapter = await LegacyAdapter.create(config);
		return new WebHookListener(apiClient, adapter, config);
	}

	/**
	 * Creates a new WebHook listener.
	 *
	 * @param apiClient The ApiClient instance to use for user info and API requests.
	 * @param adapter The connection adapter.
	 * @param config
	 */
	constructor(apiClient: ApiClient, adapter: ConnectionAdapter, config: WebHookConfig = {}) {
		this._apiClient = apiClient;
		this._adapter = adapter;
		this._hookValidity = config.hookValidity;
		this._logger = new Logger({
			name: 'twitch-webhooks',
			emoji: true,
			...(config.logger ?? {})
		});
	}

	/**
	 * Starts the backing server and listens to incoming WebHook notifications.
	 */
	async listen(): Promise<void> {
		if (this._server) {
			throw new Error('Trying to listen while already listening');
		}
		const server = this._adapter.createHttpServer();
		this._server = new Server({
			server,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onError: (e, req: Request) => {
				if (e.code === 404) {
					this._logger.warn(`Access to unknown URL/method attempted: ${req.method} ${req.url}`);
				}
			}
		});
		// needs to be first in chain but run last, for proper logging of status
		this._server.use((req, res, next) => {
			setImmediate(() => {
				this._logger.debug(`${req.method} ${req.path} - ${res.statusCode}`);
			});
			next();
		});
		this._server.all('/:id', this._createHandleRequest());
		const listenerPort = await this._adapter.getListenerPort();
		await this._server.listen(listenerPort);
		this._logger.info(`Listening on port ${listenerPort}`);

		await Promise.all([...this._subscriptions.values()].map(async sub => sub.start()));
	}

	/**
	 * Stops the backing server, suspending all active subscriptions.
	 */
	async unlisten(): Promise<void> {
		if (!this._server) {
			throw new Error('Trying to unlisten while not listening');
		}

		await this._server.close();
		this._server = undefined;

		await Promise.all([...this._subscriptions.values()].map(async sub => sub.suspend()));
	}

	/**
	 * Applies middleware that handles WebHooks to a connect-compatible app (like express).
	 *
	 * @param app The app the middleware should be applied to.
	 */
	applyMiddleware(app: ConnectCompatibleApp): void {
		let { pathPrefix } = this._adapter;
		if (pathPrefix) {
			pathPrefix = `/${pathPrefix.replace(/^\/|\/$/, '')}`;
		}
		const paramParser: RequestHandler = (req, res, next) => {
			const [, id] = req.path.split('/');
			req.param = req.params = { id };
			next();
		};
		const requestHandler = this._createHandleRequest();
		if (pathPrefix) {
			app.use(pathPrefix, paramParser, requestHandler);
		} else {
			app.use(paramParser, requestHandler);
		}
	}

	/**
	 * Subscribes to events representing a user changing a public setting or their email address.
	 *
	 * @param user The user for which to get notifications about changing a setting.
	 * @param handler The function that will be called for any new notifications.
	 * @param withEmail Whether to subscribe to email address changes. This requires an additional scope (user:read:email).
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToUserChanges(
		user: UserIdResolvable,
		handler: (user: HelixUser) => void,
		withEmail: boolean = false,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const userId = extractUserId(user);

		const subscription = new UserChangeSubscription(userId, handler, withEmail, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/**
	 * Subscribes to events representing a user being followed by other users.
	 *
	 * @param user The user for which to get notifications about the users they will be followed by.
	 * @param handler The function that will be called for any new notifications.
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToFollowsToUser(
		user: UserIdResolvable,
		handler: (follow: HelixFollow) => void,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const userId = extractUserId(user);

		const subscription = new FollowsToUserSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/**
	 * Subscribes to events representing a hype train event.
	 *
	 * @param broadcasterId The broadcaster / channel for which to get notifications about the hype train events.
	 * @param handler The function that will be called for any new notifications.
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToHypeTrainEvents(
		broadcasterId: UserIdResolvable,
		handler: (hypeTrain: HypeTrainEvent) => void,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const userId = extractUserId(broadcasterId);

		const subscription = new HypeTrainEventSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/**
	 * Subscribes to events representing a user following other users.
	 *
	 * @param user The user for which to get notifications about the users they will follow.
	 * @param handler The function that will be called for any new notifications.
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToFollowsFromUser(
		user: UserIdResolvable,
		handler: (follow: HelixFollow) => void,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const userId = extractUserId(user);

		const subscription = new FollowsFromUserSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/**
	 * Subscribes to events representing a stream changing, i.e. going live, offline or changing its title or category.
	 *
	 * @param user The user for which to get notifications about their streams changing.
	 * @param handler The function that will be called for any new notifications.
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToStreamChanges(
		user: UserIdResolvable,
		handler: (stream?: HelixStream) => void,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const userId = extractUserId(user);

		const subscription = new StreamChangeSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/**
	 * Subscribes to events representing the start or end of a channel subscription.
	 *
	 * @param user The user for which to get notifications about subscriptions to their channel.
	 * @param handler The function that will be called for any new notifications.
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToSubscriptionEvents(
		user: UserIdResolvable,
		handler: (subscriptionEvent: HelixSubscriptionEvent) => void,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const userId = extractUserId(user);

		const subscription = new SubscriptionEventSubscription(userId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/**
	 * Subscribes to events representing a ban or unban.
	 *
	 * @param broadcaster The broadcaster for which to get notifications about bans or unbans in their channel.
	 * @param handler The function that will be called for any new notifications.
	 * @param user The user that events will be sent for. If not given, events will be sent for all users.
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToBanEvents(
		broadcaster: UserIdResolvable,
		handler: (banEvent: HelixBanEvent) => void,
		user?: UserIdResolvable,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const broadcasterId = extractUserId(broadcaster);
		const userId = user ? extractUserId(user) : undefined;

		const subscription = new BanEventSubscription(broadcasterId, handler, this, userId, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/**
	 * Subscribes to events representing a user gaining or losing moderator privileges in a channel.
	 *
	 * @param broadcaster The broadcaster for which to get notifications about moderator changes in their channel.
	 * @param handler The function that will be called for any new notifications.
	 * @param user The user that events will be sent for. If not given, events will be sent for all users.
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToModeratorEvents(
		broadcaster: UserIdResolvable,
		handler: (modEvent: HelixModeratorEvent) => void,
		user?: UserIdResolvable,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const broadcasterId = extractUserId(broadcaster);
		const userId = user ? extractUserId(user) : undefined;

		const subscription = new ModeratorEventSubscription(broadcasterId, handler, this, userId, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/**
	 * Subscribes to extension transactions.
	 *
	 * @param extensionId The extension ID for which to get notifications about transactions.
	 * @param handler The function that will be called for any new notifications.
	 * @param validityInSeconds The validity of the WebHook, in seconds.
	 *
	 * Please note that this doesn't mean that you don't get any notifications after the given time. The hook will be automatically refreshed.
	 *
	 * This is meant for debugging issues. Please don't set it unless you know what you're doing.
	 */
	async subscribeToExtensionTransactions(
		extensionId: string,
		handler: (transaction: HelixExtensionTransaction) => void,
		validityInSeconds = this._hookValidity
	): Promise<Subscription> {
		const subscription = new ExtensionTransactionSubscription(extensionId, handler, this, validityInSeconds);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	/** @private */
	async _buildHookUrl(id: string): Promise<string> {
		const protocol = this._adapter.connectUsingSsl ? 'https' : 'http';

		const hostName = await this._adapter.getHostName();
		const externalPort = await this._adapter.getExternalPort();
		const protocolDefaultPort = this._adapter.connectUsingSsl ? 443 : 80;
		const hostPortion = externalPort === protocolDefaultPort ? hostName : `${hostName}:${externalPort}`;

		// trim slashes on both ends
		const pathPrefix = this._adapter.pathPrefix?.replace(/^\/|\/$/, '');

		return `${protocol}://${hostPortion}${pathPrefix ? '/' : ''}${pathPrefix ?? ''}/${id}`;
	}

	/** @private */
	_changeIdOfSubscription(oldId: string, newId: string): void {
		const sub = this._subscriptions.get(oldId);
		if (sub) {
			this._subscriptions.delete(oldId);
			this._subscriptions.set(newId, sub);
		}
	}

	/** @private */
	_dropSubscription(id: string): void {
		this._subscriptions.delete(id);
	}

	private _createHandleRequest(): RequestHandler {
		return async (req, res, next) => {
			if (req.method === 'GET') {
				this._handleVerification(req, res);
			} else if (req.method === 'POST') {
				await this._handleNotification(req, res);
			}
			next();
		};
	}

	private _handleVerification(req: Request, res: Response) {
		const { id } = req.param;
		const subscription = this._subscriptions.get(id);
		if (subscription) {
			const hubMode = req.query?.['hub.mode'];
			if (hubMode === 'subscribe') {
				subscription._verify();
				res.writeHead(202);
				res.end(req.query['hub.challenge']);
				this._logger.debug(`Successfully subscribed to hook: ${id}`);
			} else if (hubMode === 'unsubscribe') {
				this._subscriptions.delete(id);
				res.writeHead(200);
				res.end();
				this._logger.debug(`Successfully unsubscribed from hook: ${id}`);
			} else if (hubMode === 'denied') {
				this._logger.error(`Subscription denied to hook: ${id} (${req.query['hub.reason']})`);
				res.writeHead(200);
				res.end();
			} else {
				this._logger.warn(`Unknown hub.mode ${hubMode} for hook: ${id}`);
				res.writeHead(400);
				res.end();
			}
		} else {
			this._logger.warn(`Verification of unknown hook attempted: ${id}`);
			res.writeHead(410);
			res.end();
		}
	}

	private async _handleNotification(req: Request, res: Response) {
		const body = await getRawBody(req, true);
		const { id } = req.param;
		const subscription = this._subscriptions.get(id);
		if (subscription) {
			res.writeHead(202);
			res.end();
			if (subscription._handleData(body, req.headers['x-hub-signature']! as string)) {
				this._logger.debug(`Successfully verified notification signature for hook: ${id}`);
			} else {
				this._logger.warn(
					`Failed to verify notification signature for hook: ${id}. ` +
						'This might be caused by Twitch still sending notifications with an old secret and is perfectly normal a few times after you just restarted the script.\n' +
						'If the problem persists over a long period of time, please file an issue.'
				);
			}
		} else {
			this._logger.warn(`Notification for unknown hook received: ${id}`);
			res.writeHead(410);
			res.end();
		}
	}
}
