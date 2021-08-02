import type { Logger, LoggerOptions } from '@d-fischer/logger';
import { createLogger } from '@d-fischer/logger';
import getRawBody from '@d-fischer/raw-body';
import { Enumerable } from '@d-fischer/shared-utils';
import { EventEmitter } from '@d-fischer/typed-event-emitter';
import type {
	ApiClient,
	HelixEventSubSubscription,
	HelixEventSubSubscriptionStatus,
	HelixEventSubTransportData
} from '@twurple/api';
import { InvalidTokenTypeError } from '@twurple/auth';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId } from '@twurple/common';
import type { RequestHandler } from 'httpanda';
import type { EventSubChannelBanEvent } from './events/EventSubChannelBanEvent';
import type { EventSubChannelCheerEvent } from './events/EventSubChannelCheerEvent';
import type { EventSubChannelFollowEvent } from './events/EventSubChannelFollowEvent';
import type { EventSubChannelHypeTrainBeginEvent } from './events/EventSubChannelHypeTrainBeginEvent';
import type { EventSubChannelHypeTrainEndEvent } from './events/EventSubChannelHypeTrainEndEvent';
import type { EventSubChannelHypeTrainProgressEvent } from './events/EventSubChannelHypeTrainProgressEvent';
import type { EventSubChannelModeratorEvent } from './events/EventSubChannelModeratorEvent';
import type { EventSubChannelPollBeginEvent } from './events/EventSubChannelPollBeginEvent';
import type { EventSubChannelPollEndEvent } from './events/EventSubChannelPollEndEvent';
import type { EventSubChannelPollProgressEvent } from './events/EventSubChannelPollProgressEvent';
import type { EventSubChannelPredictionBeginEvent } from './events/EventSubChannelPredictionBeginEvent';
import type { EventSubChannelPredictionEndEvent } from './events/EventSubChannelPredictionEndEvent';
import type { EventSubChannelPredictionLockEvent } from './events/EventSubChannelPredictionLockEvent';
import type { EventSubChannelPredictionProgressEvent } from './events/EventSubChannelPredictionProgressEvent';
import type { EventSubChannelRaidEvent } from './events/EventSubChannelRaidEvent';
import type { EventSubChannelRedemptionAddEvent } from './events/EventSubChannelRedemptionAddEvent';
import type { EventSubChannelRedemptionUpdateEvent } from './events/EventSubChannelRedemptionUpdateEvent';
import type { EventSubChannelRewardEvent } from './events/EventSubChannelRewardEvent';
import type { EventSubChannelSubscriptionEndEvent } from './events/EventSubChannelSubscriptionEndEvent';
import type { EventSubChannelSubscriptionEvent } from './events/EventSubChannelSubscriptionEvent';
import type { EventSubChannelSubscriptionGiftEvent } from './events/EventSubChannelSubscriptionGiftEvent';
import type { EventSubChannelSubscriptionMessageEvent } from './events/EventSubChannelSubscriptionMessageEvent';
import type { EventSubChannelUnbanEvent } from './events/EventSubChannelUnbanEvent';
import type { EventSubChannelUpdateEvent } from './events/EventSubChannelUpdateEvent';
import type { EventSubExtensionBitsTransactionCreateEvent } from './events/EventSubExtensionBitsTransactionCreateEvent';
import type { EventSubStreamOfflineEvent } from './events/EventSubStreamOfflineEvent';
import type { EventSubStreamOnlineEvent } from './events/EventSubStreamOnlineEvent';
import type { EventSubUserAuthorizationRevokeEvent } from './events/EventSubUserAuthorizationRevokeEvent';
import type { EventSubUserUpdateEvent } from './events/EventSubUserUpdateEvent';
import { EventSubChannelBanSubscription } from './subscriptions/EventSubChannelBanSubscription';
import { EventSubChannelCheerSubscription } from './subscriptions/EventSubChannelCheerSubscription';
import { EventSubChannelFollowSubscription } from './subscriptions/EventSubChannelFollowSubscription';
import { EventSubChannelHypeTrainBeginSubscription } from './subscriptions/EventSubChannelHypeTrainBeginSubscription';
import { EventSubChannelHypeTrainEndSubscription } from './subscriptions/EventSubChannelHypeTrainEndSubscription';
import { EventSubChannelHypeTrainProgressSubscription } from './subscriptions/EventSubChannelHypeTrainProgressSubscription';
import { EventSubChannelModeratorAddSubscription } from './subscriptions/EventSubChannelModeratorAddSubscription';
import { EventSubChannelModeratorRemoveSubscription } from './subscriptions/EventSubChannelModeratorRemoveSubscription';
import { EventSubChannelPollBeginSubscription } from './subscriptions/EventSubChannelPollBeginSubscription';
import { EventSubChannelPollEndSubscription } from './subscriptions/EventSubChannelPollEndSubscription';
import { EventSubChannelPollProgressSubscription } from './subscriptions/EventSubChannelPollProgressSubscription';
import { EventSubChannelPredictionBeginSubscription } from './subscriptions/EventSubChannelPredictionBeginSubscription';
import { EventSubChannelPredictionEndSubscription } from './subscriptions/EventSubChannelPredictionEndSubscription';
import { EventSubChannelPredictionLockSubscription } from './subscriptions/EventSubChannelPredictionLockSubscription';
import { EventSubChannelPredictionProgressSubscription } from './subscriptions/EventSubChannelPredictionProgressSubscription';
import { EventSubChannelRaidSubscription } from './subscriptions/EventSubChannelRaidSubscription';
import { EventSubChannelRedemptionAddSubscription } from './subscriptions/EventSubChannelRedemptionAddSubscription';
import { EventSubChannelRedemptionUpdateSubscription } from './subscriptions/EventSubChannelRedemptionUpdateSubscription';
import { EventSubChannelRewardAddSubscription } from './subscriptions/EventSubChannelRewardAddSubscription';
import { EventSubChannelRewardRemoveSubscription } from './subscriptions/EventSubChannelRewardRemoveSubscription';
import { EventSubChannelRewardUpdateSubscription } from './subscriptions/EventSubChannelRewardUpdateSubscription';
import { EventSubChannelSubscriptionEndSubscription } from './subscriptions/EventSubChannelSubscriptionEndSubscription';
import { EventSubChannelSubscriptionGiftSubscription } from './subscriptions/EventSubChannelSubscriptionGiftSubscription';
import { EventSubChannelSubscriptionMessageSubscription } from './subscriptions/EventSubChannelSubscriptionMessageSubscription';
import { EventSubChannelSubscriptionSubscription } from './subscriptions/EventSubChannelSubscriptionSubscription';
import { EventSubChannelUnbanSubscription } from './subscriptions/EventSubChannelUnbanSubscription';
import { EventSubChannelUpdateSubscription } from './subscriptions/EventSubChannelUpdateSubscription';
import { EventSubExtensionBitsTransactionCreateSubscription } from './subscriptions/EventSubExtensionBitsTransactionCreateSubscription';
import { EventSubStreamOfflineSubscription } from './subscriptions/EventSubStreamOfflineSubscription';
import { EventSubStreamOnlineSubscription } from './subscriptions/EventSubStreamOnlineSubscription';
import type { EventSubSubscription } from './subscriptions/EventSubSubscription';
import { EventSubUserAuthorizationRevokeSubscription } from './subscriptions/EventSubUserAuthorizationRevokeSubscription';
import { EventSubUserUpdateSubscription } from './subscriptions/EventSubUserUpdateSubscription';

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

const numberRegex = /^\d+$/;

/**
 * The base EventSub configuration.
 */
export interface EventSubBaseConfig {
	/**
	 * The API client that will be used to subscribe to events.
	 */
	apiClient: ApiClient;

	/**
	 * Your EventSub secret.
	 *
	 * This should be a randomly generated string, but it should be the same between restarts.
	 *
	 * WARNING: Please do not use your application's client secret!
	 */
	secret: string;

	/**
	 * Options to pass to the logger.
	 */
	logger?: Partial<LoggerOptions>;
}

/**
 * @private
 * @hideProtected
 */
export abstract class EventSubBase extends EventEmitter {
	@Enumerable(false) protected readonly _subscriptions = new Map<string, EventSubSubscription>();
	@Enumerable(false) protected _twitchSubscriptions = new Map<string, HelixEventSubSubscription>();

	/** @private */ @Enumerable(false) readonly _apiClient: ApiClient;
	/** @private */ @Enumerable(false) readonly _secret: string;

	/** @private */ readonly _logger: Logger;

	protected _readyToSubscribe = false;

	/**
	 * Fires when a subscription is successfully verified or fails to verify.
	 *
	 * @param success Whether the verification succeeded.
	 * @param subscription The subscription that was verified.
	 */
	readonly onVerify = this.registerEvent<[success: boolean, subscription: EventSubSubscription]>();

	/**
	 * Fires when a subscription is revoked.
	 *
	 * @param subscription The subscription that was revoked.
	 */
	readonly onRevoke = this.registerEvent<[subscription: EventSubSubscription]>();

	constructor(config: EventSubBaseConfig) {
		super();
		if (config.apiClient._authProvider.tokenType !== 'app') {
			throw new InvalidTokenTypeError(
				'EventSub requires app access tokens to work; please use the ClientCredentialsAuthProvider in your API client.'
			);
		}
		// catch the examples copied verbatim
		if (!config.secret || config.secret === 'thisShouldBeARandomlyGeneratedFixedString') {
			throw new Error('Please generate a secret and pass it to the constructor!');
		}
		this._apiClient = config.apiClient;
		this._secret = config.secret;
		this._logger = createLogger({
			name: 'twurple:eventsub',
			emoji: true,
			...config.logger
		});
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
				'EventSubListener#subscribeToChannelSubscriptionEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelSubscriptionSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user gifting a subscription to a channel to someone else.
	 *
	 * @param user The user for which to get notifications for about subscriptions people gift in their channel.
	 * @param handler  The function that will be called for any new notifications.
	 */
	async subscribeToChannelSubscriptionGiftEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionGiftEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelSubscriptionGiftEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelSubscriptionGiftSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user's subscription to a channel being announced.
	 *
	 * @param user The user for which to get notifications for about announced subscriptions.
	 * @param handler  The function that will be called for any new notifications.
	 */
	async subscribeToChannelSubscriptionMessageEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionMessageEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelSubscriptionMessageEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelSubscriptionMessageSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user's subscription to a channel ending.
	 *
	 * @param user The user for which to get notifications for about ending subscriptions.
	 * @param handler  The function that will be called for any new notifications.
	 */
	async subscribeToChannelSubscriptionEndEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionEndEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelSubscriptionEndEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelSubscriptionEndSubscription, handler, this, userId);
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
	 * Subscribes to events that represent a user getting moderator permissions in a channel.
	 *
	 * @param user The user for which to get notifications for when users get moderator permissions in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelModeratorAddEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelModeratorEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelModeratorAddEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelModeratorAddSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user losing moderator permissions in a channel.
	 *
	 * @param user The user for which to get notifications for when users lose moderator permissions in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelModeratorRemoveEvents(
		user: UserIdResolvable,
		handler: (event: EventSubChannelModeratorEvent) => void
	): Promise<EventSubSubscription> {
		const userId = extractUserId(user);

		if (!numberRegex.test(userId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelModeratorRemoveEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelModeratorRemoveSubscription, handler, this, userId);
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
	 * Subscribes to events that represent a poll starting in a channel.
	 *
	 * @param user The broadcaster for which to receive poll begin events.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelPollBeginEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollBeginEvent) => void
	): Promise<EventSubSubscription> {
		const broadcasterId = extractUserId(user);

		if (!numberRegex.test(broadcasterId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelPollBeginEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelPollBeginSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a poll being voted on in a channel.
	 *
	 * @param user The broadcaster for which to receive poll progress events.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelPollProgressEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollProgressEvent) => void
	): Promise<EventSubSubscription> {
		const broadcasterId = extractUserId(user);

		if (!numberRegex.test(broadcasterId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelPollProgressEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelPollProgressSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a poll ending in a channel.
	 *
	 * @param user The broadcaster for which to receive poll end events.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelPollEndEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollEndEvent) => void
	): Promise<EventSubSubscription> {
		const broadcasterId = extractUserId(user);

		if (!numberRegex.test(broadcasterId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelPollEndEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelPollEndSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a prediction starting in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction begin events.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelPredictionBeginEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionBeginEvent) => void
	): Promise<EventSubSubscription> {
		const broadcasterId = extractUserId(user);

		if (!numberRegex.test(broadcasterId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelPredictionBeginEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelPredictionBeginSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a prediction being voted on in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction progress events.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelPredictionProgressEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionProgressEvent) => void
	): Promise<EventSubSubscription> {
		const broadcasterId = extractUserId(user);

		if (!numberRegex.test(broadcasterId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelPredictionProgressEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(
			EventSubChannelPredictionProgressSubscription,
			handler,
			this,
			broadcasterId
		);
	}

	/**
	 * Subscribes to events that represent a prediction being locked in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction lock events.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelPredictionLockEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionLockEvent) => void
	): Promise<EventSubSubscription> {
		const broadcasterId = extractUserId(user);

		if (!numberRegex.test(broadcasterId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelPredictionLockEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelPredictionLockSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a prediction ending in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction end events.
	 * @param handler The function that will be called for any new notifications.
	 */
	async subscribeToChannelPredictionEndEvents(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionEndEvent) => void
	): Promise<EventSubSubscription> {
		const broadcasterId = extractUserId(user);

		if (!numberRegex.test(broadcasterId)) {
			this._logger.warn(
				'EventSubListener#subscribeToChannelPredictionEndEvents: The given user is a non-numeric string. You might be sending a user name instead of a user ID.'
			);
		}
		return await this._genericSubscribe(EventSubChannelPredictionEndSubscription, handler, this, broadcasterId);
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
	 * Subscribes to events that represent a Bits transaction in an extension.
	 *
	 * @param clientId The Client ID of the extension for which to get notifications for about Bits transactions.
	 * @param handler  The function that will be called for any new notifications.
	 */
	async subscribeToExtensionBitsTransactionCreateEvents(
		clientId: string,
		handler: (event: EventSubExtensionBitsTransactionCreateEvent) => void
	): Promise<EventSubSubscription> {
		return await this._genericSubscribe(
			EventSubExtensionBitsTransactionCreateSubscription,
			handler,
			this,
			clientId
		);
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
		const hostName = await this.getHostName();

		// trim slashes on both ends
		const pathPrefix = (await this.getPathPrefix())?.replace(/^\/|\/$/, '');

		return `https://${hostName}${pathPrefix ? '/' : ''}${pathPrefix ?? ''}/${id}`;
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

	protected abstract getHostName(): Promise<string>;
	protected abstract getPathPrefix(): Promise<string | undefined>;

	protected async _resumeExistingSubscriptions(): Promise<void> {
		const subscriptions = await this._apiClient.eventSub.getSubscriptionsPaginated().getAll();

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

	protected _createHandleRequest(): RequestHandler {
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
					const data = JSON.parse(body) as EventSubBody;
					if (verified) {
						if (type === 'webhook_callback_verification') {
							const verificationBody = data as EventSubVerificationBody;
							this.emit(this.onVerify, true, subscription);
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
						} else if (type === 'revocation') {
							this._dropSubscription(subscription.id);
							this._dropTwitchSubscription(subscription.id);
							this.emit(this.onRevoke, subscription);
							this._logger.debug(`Subscription revoked by Twitch for event: ${id}`);
						} else {
							this._logger.warn(`Unknown action ${type} for event: ${id}`);
							res.writeHead(400);
							res.end();
						}
					} else {
						this._logger.warn(`Could not verify action ${type} of event: ${id}`);
						if (type === 'webhook_callback_verification') {
							this.emit(this.onVerify, false, subscription);
						}
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

	private async _genericSubscribe<T, Args extends unknown[]>(
		clazz: new (handler: (obj: T) => void, client: EventSubBase, ...args: Args) => EventSubSubscription<T>,
		handler: (obj: T) => void,
		client: EventSubBase,
		...params: Args
	): Promise<EventSubSubscription> {
		const subscription = new clazz(handler, client, ...params);
		if (this._readyToSubscribe) {
			await subscription.start(this._twitchSubscriptions.get(subscription.id));
		}
		this._subscriptions.set(subscription.id, subscription as EventSubSubscription);

		return subscription as EventSubSubscription;
	}
}
