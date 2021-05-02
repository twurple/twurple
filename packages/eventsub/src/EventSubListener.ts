import type { LoggerOptions } from '@d-fischer/logger';
import { Logger } from '@d-fischer/logger';
import getRawBody from '@d-fischer/raw-body';
import { Enumerable } from '@d-fischer/shared-utils';
import type {
	ApiClient,
	HelixEventSubSubscription,
	HelixEventSubSubscriptionStatus,
	HelixEventSubTransportData
} from '@twurple/api';
import { InvalidTokenTypeError } from '@twurple/auth';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import type { Request, RequestHandler } from 'httpanda';
import { Server } from 'httpanda';
import type { ConnectionAdapter } from './Adapters/ConnectionAdapter';
import type { ConnectCompatibleApp, ConnectCompatibleMiddleware } from './ConnectCompatibleApp';
import type { EventSubChannelBanEvent } from './Events/EventSubChannelBanEvent';
import type { EventSubChannelCheerEvent } from './Events/EventSubChannelCheerEvent';
import type { EventSubChannelFollowEvent } from './Events/EventSubChannelFollowEvent';
import type { EventSubChannelHypeTrainBeginEvent } from './Events/EventSubChannelHypeTrainBeginEvent';
import type { EventSubChannelHypeTrainEndEvent } from './Events/EventSubChannelHypeTrainEndEvent';
import type { EventSubChannelHypeTrainProgressEvent } from './Events/EventSubChannelHypeTrainProgressEvent';
import type { EventSubChannelRaidEvent } from './Events/EventSubChannelRaidEvent';
import type { EventSubChannelRedemptionAddEvent } from './Events/EventSubChannelRedemptionAddEvent';
import type { EventSubChannelRedemptionUpdateEvent } from './Events/EventSubChannelRedemptionUpdateEvent';
import type { EventSubChannelRewardEvent } from './Events/EventSubChannelRewardEvent';
import type { EventSubChannelSubscriptionEvent } from './Events/EventSubChannelSubscriptionEvent';
import type { EventSubChannelUnbanEvent } from './Events/EventSubChannelUnbanEvent';
import type { EventSubChannelUpdateEvent } from './Events/EventSubChannelUpdateEvent';
import type { EventSubStreamOfflineEvent } from './Events/EventSubStreamOfflineEvent';
import type { EventSubStreamOnlineEvent } from './Events/EventSubStreamOnlineEvent';
import type { EventSubUserAuthorizationRevokeEvent } from './Events/EventSubUserAuthorizationRevokeEvent';
import type { EventSubUserUpdateEvent } from './Events/EventSubUserUpdateEvent';
import { EventSubChannelBanSubscription } from './Subscriptions/EventSubChannelBanSubscription';
import { EventSubChannelCheerSubscription } from './Subscriptions/EventSubChannelCheerSubscription';
import { EventSubChannelFollowSubscription } from './Subscriptions/EventSubChannelFollowSubscription';
import { EventSubChannelHypeTrainBeginSubscription } from './Subscriptions/EventSubChannelHypeTrainBeginSubscription';
import { EventSubChannelHypeTrainEndSubscription } from './Subscriptions/EventSubChannelHypeTrainEndSubscription';
import { EventSubChannelHypeTrainProgressSubscription } from './Subscriptions/EventSubChannelHypeTrainProgressSubscription';
import { EventSubChannelRaidSubscription } from './Subscriptions/EventSubChannelRaidSubscription';
import { EventSubChannelRedemptionAddSubscription } from './Subscriptions/EventSubChannelRedemptionAddSubscription';
import { EventSubChannelRedemptionUpdateSubscription } from './Subscriptions/EventSubChannelRedemptionUpdateSubscription';
import { EventSubChannelRewardAddSubscription } from './Subscriptions/EventSubChannelRewardAddSubscription';
import { EventSubChannelRewardRemoveSubscription } from './Subscriptions/EventSubChannelRewardRemoveSubscription';
import { EventSubChannelRewardUpdateSubscription } from './Subscriptions/EventSubChannelRewardUpdateSubscription';
import { EventSubChannelSubscriptionSubscription } from './Subscriptions/EventSubChannelSubscriptionSubscription';
import { EventSubChannelUnbanSubscription } from './Subscriptions/EventSubChannelUnbanSubscription';
import { EventSubChannelUpdateSubscription } from './Subscriptions/EventSubChannelUpdateSubscription';
import { EventSubStreamOfflineSubscription } from './Subscriptions/EventSubStreamOfflineSubscription';
import { EventSubStreamOnlineSubscription } from './Subscriptions/EventSubStreamOnlineSubscription';
import type { EventSubSubscription, SubscriptionResultType } from './Subscriptions/EventSubSubscription';
import { EventSubUserAuthorizationRevokeSubscription } from './Subscriptions/EventSubUserAuthorizationRevokeSubscription';
import { EventSubUserUpdateSubscription } from './Subscriptions/EventSubUserUpdateSubscription';

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

/** @private */
interface EventSubSubscriptionBody {
	id: string;
	status: HelixEventSubSubscriptionStatus;
	type: string;
	version: string;
	condition: Record<string, string>;
	transport: HelixEventSubTransportData;
	created_at: string;
}

/** @private */
interface BaseEventSubBody {
	subscription: EventSubSubscriptionBody;
}

/** @private */
interface EventSubVerificationBody extends BaseEventSubBody {
	challenge: string;
}

/** @private */
interface EventSubNotificationBody extends BaseEventSubBody {
	event: Record<string, unknown>;
}

/** @private */
type EventSubBody = EventSubVerificationBody | EventSubNotificationBody;

/**
 * A listener for the Twitch EventSub event distribution mechanism.
 */
@rtfm('eventsub', 'EventSubListener')
export class EventSubListener {
	@Enumerable(false) private _server?: Server;
	@Enumerable(false) private readonly _subscriptions = new Map<string, EventSubSubscription>();
	@Enumerable(false) private _twitchSubscriptions = new Map<string, HelixEventSubSubscription>();

	/** @private */ @Enumerable(false) readonly _apiClient: ApiClient;
	/** @private */ @Enumerable(false) readonly _secret: string;
	private readonly _adapter: ConnectionAdapter;
	/** @private */ readonly _logger: Logger;
	private _currentListenerPort?: number;

	/**
	 * Creates a new EventSub listener.
	 *
	 * @param apiClient The ApiClient instance to use for user info and API requests.
	 * @param secret The secret for Twitch to sign payloads with.
	 * @param adapter The connection adapter.
	 * @param config
	 */
	constructor(apiClient: ApiClient, adapter: ConnectionAdapter, secret: string, config?: EventSubConfig) {
		if (apiClient._authProvider.tokenType !== 'app') {
			throw new InvalidTokenTypeError(
				'EventSub requires app access tokens to work; please use the ClientCredentialsAuthProvider in your API client.'
			);
		}
		this._apiClient = apiClient;
		this._secret = secret;
		this._adapter = adapter;
		this._logger = new Logger({
			name: '@twurple/eventsub',
			emoji: true,
			...config?.logger
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
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e.code === 404) {
					this._logger.warn(`Access to unknown URL/method attempted: ${req.method!} ${req.url!}`);
				}
			}
		});
		// needs to be first in chain but run last, for proper logging of status
		this._server.use((req, res, next) => {
			setImmediate(() => {
				this._logger.debug(`${req.method!} ${req.path} - ${res.statusCode}`);
			});
			next();
		});
		this._server.post('/:id', this._createHandleRequest());
		const adapterListenerPort = await this._adapter.getListenerPort();
		if (adapterListenerPort && port) {
			this._logger.warn(`Your passed port (${port}) is being ignored because the adapter has overridden it.
Listening on port ${adapterListenerPort} instead.`);
		}
		const listenerPort = adapterListenerPort ?? port ?? 443;
		await this._server.listen(listenerPort);
		this._currentListenerPort = listenerPort;
		this._logger.info(`Listening on port ${listenerPort}`);
		await this.resumeExistingSubscriptions();
	}

	/**
	 * Resumes subscriptions that are already registered with Twitch.
	 */
	async resumeExistingSubscriptions(): Promise<void> {
		const subscriptions = await this._apiClient.helix.eventSub.getSubscriptionsPaginated().getAll();

		const urlPrefix = await this._buildHookUrl('');
		this._twitchSubscriptions = new Map<string, HelixEventSubSubscription>(
			subscriptions
				.map((sub): [string, HelixEventSubSubscription] | undefined => {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (sub._transport.method === 'webhook') {
						const url = sub._transport.callback;
						if (url.startsWith(urlPrefix)) {
							const id = url.slice(urlPrefix.length);
							return [id, sub];
						}
					}
					return undefined;
				})
				.filter(<T>(x?: T): x is T => !!x)
		);

		await Promise.all(
			[...this._subscriptions].map(async ([subId, sub]) => await sub.start(this._twitchSubscriptions.get(subId)))
		);
	}

	/**
	 * Stops the backing server, suspending all active subscriptions.
	 */
	async unlisten(): Promise<void> {
		if (!this._server) {
			throw new Error('Trying to unlisten while not listening');
		}

		await Promise.all([...this._subscriptions.values()].map(async sub => await sub.suspend()));

		await this._server.close();
		this._server = undefined;
		this._currentListenerPort = undefined;
	}

	/**
	 * Applies middleware that handles EventSub notifications to a connect-compatible app (like express).
	 *
	 * The express app should be started before this.
	 *
	 * @param app The app the middleware should be applied to.
	 */
	async applyMiddleware(app: ConnectCompatibleApp): Promise<void> {
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
			app.use(
				pathPrefix,
				paramParser as ConnectCompatibleMiddleware,
				requestHandler as ConnectCompatibleMiddleware
			);
		} else {
			app.use(paramParser as ConnectCompatibleMiddleware, requestHandler as ConnectCompatibleMiddleware);
		}

		// stub to fix subscription registration
		this._currentListenerPort = -1;
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

		return await this._genericSubscribe(EventSubStreamOnlineSubscription, handler, this, userId);
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

		return await this._genericSubscribe(EventSubStreamOfflineSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events representing a change in channel metadata, e.g. stream title or category.
	 *
	 * @param user The user for which to get notifications about updates.
	 * @param handler The function that will be called for any new notifications.
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
		return await this._genericSubscribe(EventSubChannelUpdateSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user following a channel.
	 *
	 * @param user The user for which to get notifications about their followers.
	 * @param handler The function that will be called for any new notifications.
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
		return await this._genericSubscribe(EventSubChannelFollowSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user subscribing to a channel.
	 *
	 * @param user The user for which to get notifications for about their subscribers.
	 * @param handler  The function that will be called for any new notifications.
	 */
	async subscribeToChannelSubscriptionEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelSubscribeEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelSubscriptionSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user cheering some bits.
	 *
	 * @param user The user for which to get notifications for about cheers they get.
	 * @param handler The function that will be called for any new notifications.
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
		return await this._genericSubscribe(EventSubChannelCheerSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user getting banned from a channel.
	 *
	 * @param user The user for which to get notifications for when users get banned in their channel.
	 * @param handler The function that will be called for any new notifications.
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
		return await this._genericSubscribe(EventSubChannelBanSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user getting unbanned from a channel.
	 *
	 * @param user The user for which to get notifications for when users get unbanned in their channel.
	 * @param handler The function that will be called for any new notifications.
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
		return await this._genericSubscribe(EventSubChannelUnbanSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a broadcaster raiding another broadcaster.
	 *
	 * @param user The broadcaster for which to get outgoing raid notifications.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRaidEventsFrom(
		user: UserIdResolvable,
		handler: (event: EventSubChannelRaidEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelRaidEventsFrom: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRaidSubscription, handler, this, userId, 'from');
	}

	/**
	 * Subscribes to events that represent a broadcaster being raided by another broadcaster.
	 *
	 * @param user The broadcaster for which to get incoming raid notifications.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRaidEventsTo(
		user: UserIdResolvable,
		handler: (event: EventSubChannelRaidEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelRaidEventsTo: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRaidSubscription, handler, this, userId, 'to');
	}

	/**
	 * Subscribes to events that represent a Channel Points reward being added to a channel.
	 *
	 * @param user The user for which to get notifications for when they add a reward to their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRewardAddEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelRewardAddEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRewardAddSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a Channel Points reward being updated.
	 *
	 * @param user The user for which to get notifications for when they update a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRewardUpdateEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToRewardUpdateEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRewardUpdateSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points reward being updated.
	 *
	 * @param user The user for which to get notifications for when they update the reward.
	 * @param rewardId The ID of the reward for which to get notifications when it is updated.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRewardUpdateEventsForReward(
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRewardEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToRewardUpdateEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRewardUpdateSubscription, handler, this, userId, rewardId);
	}

	/**
	 * Subscribes to events that represent a Channel Points reward being removed.
	 *
	 * @param user The user for which to get notifications for when they remove a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRewardRemoveEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToRewardRemoveEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRewardRemoveSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points reward being removed.
	 *
	 * @param user The user for which to get notifications for when they remove the reward.
	 * @param rewardId The ID of the reward to get notifications for when it is removed.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRewardRemoveEventsForReward(
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRewardEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToRewardRemoveEventsForReward: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRewardRemoveSubscription, handler, this, userId, rewardId);
	}

	/**
	 * Subscribes to events that represents a Channel Points reward being redeemed.
	 *
	 * @param user The user for which to get notifications for when their rewards are redeemed.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRedemptionAddEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRedemptionAddEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelRedemptionEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRedemptionAddSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points reward being redeemed.
	 *
	 * @param user The user for which to get notifications when their reward is redeemed.
	 * @param rewardId The ID of the reward for which to get notifications when it is redeemed.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRedemptionAddEventsForReward(
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRedemptionAddEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToRedemptionAddEventsForReward: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRedemptionAddSubscription, handler, this, userId, rewardId);
	}

	/**
	 * Subscribes to events that represent a Channel Points reward being updated by a broadcaster.
	 *
	 * @param user The user for which to get notifications for when they update a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRedemptionUpdateEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRedemptionUpdateEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelRedemptionUpdateEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelRedemptionUpdateSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points reward being updated by a broadcaster.
	 *
	 * @param user The user for which to get notifications for when they update the reward.
	 * @param rewardId The ID of the reward for which to get notifications when it gets updated.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelRedemptionUpdateEventsForReward(
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRedemptionUpdateEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelRedemptionUpdateEventsForReward: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(
			EventSubChannelRedemptionUpdateSubscription,
			handler,
			this,
			userId,
			rewardId
		);
	}

	/**
	 * Subscribes to events that represent a Hype Train beginning.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelHypeTrainBeginEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainBeginEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelHypeTrainBeginEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelHypeTrainBeginSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent progress in a Hype Train in a channel.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelHypeTrainProgressEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainProgressEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelHypeTrainProgressEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelHypeTrainProgressSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent the end of a Hype Train in a channel.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelHypeTrainEndEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainEndEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelHypeTrainEndEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelHypeTrainEndSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user revoking authorization from an application.
	 *
	 * @param clientId The Client ID for which to get notifications about authorization revocations.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToUserAuthorizationRevokeEvents(
		clientId: string,
		handler: (data: EventSubUserAuthorizationRevokeEvent) => void
	): Promise<EventSubSubscription> {
		return await this._genericSubscribe(EventSubUserAuthorizationRevokeSubscription, handler, this, clientId);
	}
	/**
	 * Subscribes to events that represent a user updating their account details.
	 *
	 * @param user The user for which to get notifications about account updates.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToUserUpdateEvents(
		user: UserIdResolvable,
		handler: (data: EventSubUserUpdateEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToUserUpdateEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubUserUpdateSubscription, handler, this, userId);
	}

	/** @private */
	async _buildHookUrl(id: string): Promise<string> {
		const hostName = await this._adapter.getHostName();
		const externalPort = (await this._adapter.getExternalPort()) ?? this._currentListenerPort;
		if (!externalPort) {
			throw new Error('Can not build hook URL with implicit external port while not listening');
		}
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
		if (this._currentListenerPort) {
			await subscription.start(this._twitchSubscriptions.get(subscription.id));
		}
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
				const algoAndSignature = req.headers['twitch-eventsub-message-signature'] as string | undefined;
				if (algoAndSignature === undefined) {
					this._logger.warn(`Dropping unsigned message for action ${type} of event: ${id}`);
					res.writeHead(410);
					res.end();
				} else {
					const verified = subscription._verifyData(messageId, timestamp, body, algoAndSignature);
					if (verified) {
						const data = JSON.parse(body) as EventSubBody;
						if (type === 'webhook_callback_verification') {
							const verificationBody = data as EventSubVerificationBody;
							subscription._verify();
							if (twitchSubscription) {
								twitchSubscription._status = 'enabled';
							}
							res.setHeader('Content-Length', verificationBody.challenge.length);
							res.writeHead(200, undefined);
							res.end(verificationBody.challenge);
							this._logger.debug(`Successfully subscribed to event: ${id}`);
						} else if (type === 'notification') {
							subscription._handleData((data as EventSubNotificationBody).event);
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
