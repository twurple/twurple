import type { LoggerOptions } from '@d-fischer/logger';
import { Logger } from '@d-fischer/logger';
import getRawBody from '@d-fischer/raw-body';
import { Enumerable } from '@d-fischer/shared-utils';
import type { Request, RequestHandler } from 'httpanda';
import { Server } from 'httpanda';
import type { ApiClient, HelixEventSubSubscription, UserIdResolvable } from 'twitch';
import { extractUserId } from 'twitch';
import { InvalidTokenTypeError } from 'twitch-auth';
import type { ConnectionAdapter } from './Adapters/ConnectionAdapter';
import type { ConnectCompatibleApp } from './ConnectCompatibleApp';
import type { EventSubStreamOfflineEvent } from './Events/EventSubStreamOfflineEvent';
import type { EventSubStreamOnlineEvent } from './Events/EventSubStreamOnlineEvent';
import type { EventSubChannelUpdateEvent } from './Events/EventSubChannelUpdateEvent';
import type { EventSubChannelFollowEvent } from './Events/EventSubChannelFollowEvent';
import type { EventSubChannelSubscribeEvent } from './Events/EventSubChannelSubscribeEvent';
import type { EventSubChannelCheerEvent } from './Events/EventSubChannelCheerEvent';
import type { EventSubChannelBanEvent } from './Events/EventSubChannelBanEvent';
import type { EventSubChannelUnbanEvent } from './Events/EventSubChannelUnbanEvent';
import type { EventSubChannelRewardAddEvent } from './Events/EventSubChannelRewardAddEvent';
import type { EventSubChannelRewardUpdateEvent } from './Events/EventSubChannelRewardUpdateEvent';
import { EventSubStreamOfflineSubscription } from './Subscriptions/EventSubStreamOfflineSubscription';
import { EventSubStreamOnlineSubscription } from './Subscriptions/EventSubStreamOnlineSubscription';
import { EventSubChannelUpdateSubscription } from './Subscriptions/EventSubChannelUpdateSubscription';
import { EventSubChannelFollowSubscription } from './Subscriptions/EventSubChannelFollowSubscription';
import { EventSubChannelSubscribeSubscription } from './Subscriptions/EventSubChannelSubscribeSubscription';
import { EventSubChannelCheerSubscription } from './Subscriptions/EventSubChannelCheerSubscription';
import { EventSubChannelBanSubscription } from './Subscriptions/EventSubChannelBanSubscription';
import { EventSubChannelUnbanSubscription } from './Subscriptions/EventSubChannelUnbanSubscription';
import { EventSubChannelRewardAddSubscription } from './Subscriptions/EventSubChannelRewardAddSubscription';
import { EventSubChannelRewardUpdateSubscription } from './Subscriptions/EventSubChannelRewardUpdateSubscription';
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
	private _twitchSubscriptions = new Map<string, HelixEventSubSubscription>();

	/** @private */ @Enumerable(false) readonly _apiClient: ApiClient;
	/** @private */ @Enumerable(false) readonly _secret: string;
	private readonly _adapter: ConnectionAdapter;
	/** @private */ readonly _logger: Logger;

	/**
	 * Creates a new EventSub listener.
	 *
	 * @param apiClient The ApiClient instance to use for user info and API requests.
	 * @param secret The secret for Twitch to sign payloads with.
	 * @param adapter The connection adapter.
	 * @param config
	 */
	constructor(apiClient: ApiClient, adapter: ConnectionAdapter, secret: string, config: EventSubConfig = {}) {
		if (apiClient.tokenType !== 'app') {
			throw new InvalidTokenTypeError(
				'EventSub requires app access tokens to work; please use the ClientCredentialsAuthProvider in your API client.'
			);
		}
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

		const subscriptions = await this._apiClient.helix.eventSub.getSubscriptionsPaginated().getAll();

		const urlPrefix = await this._buildHookUrl('');
		this._twitchSubscriptions = new Map<string, HelixEventSubSubscription>(
			subscriptions
				.map(sub => {
					if (sub._transport.method === 'webhook') {
						const url = sub._transport.callback;
						if (url.startsWith(urlPrefix)) {
							const id = url.slice(urlPrefix.length);
							return [id, sub] as const;
						}
					}
					return undefined;
				})
				.filter(<T>(x?: T): x is T => !!x)
		);

		await Promise.all(
			[...this._subscriptions].map(async ([subId, sub]) => sub.start(this._twitchSubscriptions.get(subId)))
		);
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

	/**
	 * Subscribes to events representing a change in channel metadata, e.g. stream title or category
	 *
	 * @param user The user for which to get notifications about updates
	 * @param handler The function that will be called for any new notifications
	 */
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

	/**
	 * Subscribes to events that represent a user following a channel
	 *
	 * @param user The user for which to get notifications about their followers
	 * @param handler The function that will be called for any new notifications
	 */
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

	/**
	 * Subscribes to events that represent a user subscribing to a channel
	 *
	 * @param user The user for which to get notifications for about their subscribers
	 * @param handler  The function that will be called for any new notifications
	 */
	async subscribeToChannelSubscribeEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscribeEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelSubscribeEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelSubscribeSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user cheering some bits
	 *
	 * @param user The user for which to get notifications for about cheers they get
	 * @param handler The function that will be called for any new notifications
	 */
	async subscribeToChannelCheerEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelCheerEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelCheerEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelCheerSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user getting banned from a channel
	 *
	 * @param user The user for which to get notifications for when users get banned in their channel
	 * @param handler The function that will be called for any new notifications
	 */
	async subscribeToChannelBanEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelBanEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelBanEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelBanSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user getting unbanned from a channel
	 *
	 * @param user The user for which to get notifications for when users get unbanned in their channel
	 * @param handler The function that will be called for any new notifications
	 */
	async subscribeToChannelUnbanEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelUnbanEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelUnbanEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelUnbanSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a Channel Points Reward being added to a channel.
	 *
	 * @param user The user for which to get notifications for when they add a reward to their channel
	 * @param handler The function that will be called for any new notifications
	 */
	async subscribeToChannelRewardAddEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardAddEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelRewardAddEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelRewardAddSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a Channel Points Reward being updated
	 *
	 * @param user The user for which to get notifications for when they update a reward
	 * @param handler The function that will be called for any new notifications
	 */
	async subscribeToChannelRewardUpdateEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardUpdateEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToRewardUpdateEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelRewardUpdateSubscription, handler, this, userId);
	}

	async subscribeToChannelRewardRemoveEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardUpdateEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToRewardRemoveEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return this._genericSubscribe(EventSubChannelRewardRemoveSubscription, handler, this, userId);
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

	/** @private */
	_dropTwitchSubscription(id: string): void {
		this._twitchSubscriptions.delete(id);
	}

	/** @private */
	_registerTwitchSubscription(id: string, data: HelixEventSubSubscription): void {
		this._twitchSubscriptions.set(id, data);
	}

	private async _genericSubscribe<T extends EventSubSubscription, Args extends unknown[]>(
		clazz: new (handler: (obj: SubscriptionResultType<T>) => void, client: this, ...args: Args) => T,
		handler: (obj: SubscriptionResultType<T>) => void,
		client: this,
		...params: Args
	): Promise<EventSubSubscription> {
		const subscription = new clazz(handler, client, ...params);
		await subscription.start(this._twitchSubscriptions.get(subscription.id));
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	private _createHandleRequest(): RequestHandler {
		return async (req, res, next) => {
			const { id } = req.param;
			const subscription = this._subscriptions.get(id);
			const twitchSubscription = this._twitchSubscriptions.get(id);
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
						if (twitchSubscription) {
							twitchSubscription._status = 'enabled';
						}
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
