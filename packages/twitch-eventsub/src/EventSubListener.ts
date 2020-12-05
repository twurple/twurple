import type { LoggerOptions } from '@d-fischer/logger';
import { Logger } from '@d-fischer/logger';
import getRawBody from '@d-fischer/raw-body';
import { Enumerable } from '@d-fischer/shared-utils';
import type { Request, RequestHandler } from 'httpanda';
import { Server } from 'httpanda';
import type { ApiClient, UserIdResolvable } from 'twitch';
import { extractUserId } from 'twitch';
import type { ConnectionAdapter } from './Adapters/ConnectionAdapter';
import type { ConnectCompatibleApp } from './ConnectCompatibleApp';
import type { EventSubStreamOfflineEvent } from './Events/EventSubStreamOfflineEvent';
import type { EventSubStreamOnlineEvent } from './Events/EventSubStreamOnlineEvent';
import type { EventSubChannelUpdateEvent } from './Events/EventSubChannelUpdateEvent';
import type { EventSubChannelFollowEvent } from './Events/EventSubChannelFollowEvent';
import { EventSubStreamOfflineSubscription } from './Subscriptions/EventSubStreamOfflineSubscription';
import { EventSubStreamOnlineSubscription } from './Subscriptions/EventSubStreamOnlineSubscription';
import { EventSubChannelUpdateSubscription } from './Subscriptions/EventSubChannelUpdateSubscription';
import { EventSubChannelFollowSubscription } from './Subscriptions/EventSubChannelFollowSubscription';
import type { EventSubSubscription, SubscriptionResultType } from './Subscriptions/EventSubSubscription';

/**
 * Certificate data used to make the listener server SSL capable.
 */
export interface EventSubListenerCertificateConfig {
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
 * The configuration of a EventSub listener.
 */
export interface EventSubConfig {
	/**
	 * Options to pass to the logger.
	 */
	logger?: Partial<LoggerOptions>;
}

const numberRegex = /^\d+$/;

/**
 * A listener for the Twitch EventSub event distribution mechanism.
 */
export class EventSubListener {
	private _server?: Server;
	private readonly _subscriptions = new Map<string, EventSubSubscription>();

	/** @private */ @Enumerable(false) readonly _apiClient: ApiClient;
	/** @private */ @Enumerable(false) readonly _secret: string;
	private readonly _adapter: ConnectionAdapter;
	private readonly _logger: Logger;

	/**
	 * Creates a new EventSub listener.
	 *
	 * @param apiClient The ApiClient instance to use for user info and API requests.
	 * @param secret The secret for Twitch to sign payloads with.
	 * @param adapter The connection adapter.
	 * @param config
	 */
	constructor(apiClient: ApiClient, secret: string, adapter: ConnectionAdapter, config: EventSubConfig = {}) {
		this._apiClient = apiClient;
		this._secret = secret;
		this._adapter = adapter;
		this._logger = new Logger({
			name: 'twitch-eventsub',
			emoji: true,
			...(config.logger ?? {})
		});
	}

	/**
	 * Starts the backing server and listens to incoming EventSub notifications.
	 */
	async listen(port?: number): Promise<void> {
		if (this._server) {
			throw new Error('Trying to listen while already listening');
		}
		const server = this._adapter.createHttpServer();
		this._server = new Server({
			server,
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
		this._server.post('/:id', this._createHandleRequest());
		const listenerPort = (await this._adapter.getListenerPort()) ?? port;
		if (!port) {
			throw new Error("Adapter didn't define a listener port; please pass one as an argument");
		}
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

		await Promise.all([...this._subscriptions.values()].map(async sub => sub.suspend()));

		await this._server.close();
		this._server = undefined;
	}

	/**
	 * Applies middleware that handles EventSub notifications to a connect-compatible app (like express).
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
	 * Subscribes to events representing a stream going live.
	 *
	 * @param user The user for which to get notifications about their streams going live.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToStreamOnlineEvents(
		user: UserIdResolvable,
		handler: (event: EventSubStreamOnlineEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToStreamOnlineEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}

		return this._genericSubscribe(EventSubStreamOnlineSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events representing a stream going offline.
	 *
	 * @param user The user for which to get notifications about their streams going offline.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToStreamOfflineEvents(
		user: UserIdResolvable,
		handler: (event: EventSubStreamOfflineEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToStreamOfflineEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}

		return this._genericSubscribe(EventSubStreamOfflineSubscription, handler, this, userId);
	}

	async subscribeToChannelUpdateEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelUpdateEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelUpdateEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelUpdateSubscription, handler, this, userId);
	}

	async subscribeToChannelFollowEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelFollowEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelFollowEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelFollowSubscription, handler, this, userId);
	}
	/** @private */
	async _buildHookUrl(id: string): Promise<string> {
		const hostName = await this._adapter.getHostName();
		const externalPort = await this._adapter.getExternalPort();
		const hostPortion = externalPort === 443 ? hostName : `${hostName}:${externalPort}`;

		// trim slashes on both ends
		const pathPrefix = this._adapter.pathPrefix?.replace(/^\/|\/$/, '');

		return `https://${hostPortion}${pathPrefix ? '/' : ''}${pathPrefix ?? ''}/${id}`;
	}

	/** @private */
	_dropSubscription(id: string): void {
		this._subscriptions.delete(id);
	}

	private async _genericSubscribe<T extends EventSubSubscription, Args extends unknown[]>(
		clazz: new (handler: (obj: SubscriptionResultType<T>) => void, client: this, ...args: Args) => T,
		handler: (obj: SubscriptionResultType<T>) => void,
		client: this,
		...params: Args
	): Promise<EventSubSubscription> {
		const subscription = new clazz(handler, client, ...params);
		await subscription.start();
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	private _createHandleRequest(): RequestHandler {
		return async (req, res, next) => {
			const { id } = req.param;
			const subscription = this._subscriptions.get(id);
			const type = req.headers['twitch-eventsub-message-type'] as string;
			if (subscription) {
				const messageId = req.headers['twitch-eventsub-message-id'] as string;
				const timestamp = req.headers['twitch-eventsub-message-timestamp'] as string;
				const body = await getRawBody(req, true);
				const algoAndSignature = req.headers['twitch-eventsub-message-signature'] as string;
				const verified = subscription._verifyData(messageId, timestamp, body, algoAndSignature);
				if (verified) {
					const data = JSON.parse(body);
					if (type === 'webhook_callback_verification') {
						subscription._verify();
						res.setHeader('Content-Length', data.challenge.length);
						res.writeHead(200, undefined);
						res.end(data.challenge);
						this._logger.debug(`Successfully subscribed to event: ${id}`);
					} else if (type === 'notification') {
						subscription._handleData(data.event);
						res.writeHead(202);
						res.end();
					} else {
						this._logger.warn(`Unknown action ${type} for event: ${id}`);
						res.writeHead(400);
						res.end();
					}
				} else {
					this._logger.warn(`Could not verify action ${type} of event: ${id}`);
					res.writeHead(410);
					res.end();
				}
			} else {
				this._logger.warn(`Action ${type} of unknown event attempted: ${id}`);
				res.writeHead(410);
				res.end();
			}
			next();
		};
	}
}
