import { createLogger, type Logger, type LoggerOptions } from '@d-fischer/logger';
import { Enumerable } from '@d-fischer/shared-utils';
import { EventEmitter } from '@d-fischer/typed-event-emitter';
import {
	type ApiClient,
	extractUserId,
	type HelixEventSubDropEntitlementGrantFilter,
	type HelixEventSubSubscription,
	type HelixEventSubSubscriptionStatus,
	type HelixEventSubTransportOptions,
	type UserIdResolvable,
} from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelChatNotificationEvent } from './events/chatNotifications/EventSubChannelChatNotificationEvent';
import type { EventSubChannelAdBreakBeginEvent } from './events/EventSubChannelAdBreakBeginEvent';
import type { EventSubChannelBanEvent } from './events/EventSubChannelBanEvent';
import type { EventSubChannelCharityCampaignProgressEvent } from './events/EventSubChannelCharityCampaignProgressEvent';
import type { EventSubChannelCharityCampaignStartEvent } from './events/EventSubChannelCharityCampaignStartEvent';
import type { EventSubChannelCharityCampaignStopEvent } from './events/EventSubChannelCharityCampaignStopEvent';
import type { EventSubChannelCharityDonationEvent } from './events/EventSubChannelCharityDonationEvent';
import type { EventSubChannelChatClearEvent } from './events/EventSubChannelChatClearEvent';
import type { EventSubChannelChatClearUserMessagesEvent } from './events/EventSubChannelChatClearUserMessagesEvent';
import type { EventSubChannelChatMessageDeleteEvent } from './events/EventSubChannelChatMessageDeleteEvent';
import { type EventSubChannelChatMessageEvent } from './events/EventSubChannelChatMessageEvent';
import type { EventSubChannelChatSettingsUpdateEvent } from './events/EventSubChannelChatSettingsUpdateEvent';
import type { EventSubChannelCheerEvent } from './events/EventSubChannelCheerEvent';
import type { EventSubChannelFollowEvent } from './events/EventSubChannelFollowEvent';
import type { EventSubChannelGoalBeginEvent } from './events/EventSubChannelGoalBeginEvent';
import type { EventSubChannelGoalEndEvent } from './events/EventSubChannelGoalEndEvent';
import type { EventSubChannelGoalProgressEvent } from './events/EventSubChannelGoalProgressEvent';
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
import type { EventSubChannelAutomaticRewardRedemptionAddEvent } from './events/EventSubChannelAutomaticRewardRedemptionAddEvent';
import type { EventSubChannelShieldModeBeginEvent } from './events/EventSubChannelShieldModeBeginEvent';
import type { EventSubChannelShieldModeEndEvent } from './events/EventSubChannelShieldModeEndEvent';
import type { EventSubChannelShoutoutCreateEvent } from './events/EventSubChannelShoutoutCreateEvent';
import type { EventSubChannelShoutoutReceiveEvent } from './events/EventSubChannelShoutoutReceiveEvent';
import type { EventSubChannelSubscriptionEndEvent } from './events/EventSubChannelSubscriptionEndEvent';
import type { EventSubChannelSubscriptionEvent } from './events/EventSubChannelSubscriptionEvent';
import type { EventSubChannelSubscriptionGiftEvent } from './events/EventSubChannelSubscriptionGiftEvent';
import type { EventSubChannelSubscriptionMessageEvent } from './events/EventSubChannelSubscriptionMessageEvent';
import type { EventSubChannelUnbanEvent } from './events/EventSubChannelUnbanEvent';
import { type EventSubChannelUnbanRequestCreateEvent } from './events/EventSubChannelUnbanRequestCreateEvent';
import { type EventSubChannelUnbanRequestResolveEvent } from './events/EventSubChannelUnbanRequestResolveEvent';
import type { EventSubChannelUpdateEvent } from './events/EventSubChannelUpdateEvent';
import { type EventSubDropEntitlementGrantEvent } from './events/EventSubDropEntitlementGrantEvent';
import type { EventSubExtensionBitsTransactionCreateEvent } from './events/EventSubExtensionBitsTransactionCreateEvent';
import type { EventSubStreamOfflineEvent } from './events/EventSubStreamOfflineEvent';
import type { EventSubStreamOnlineEvent } from './events/EventSubStreamOnlineEvent';
import type { EventSubUserAuthorizationGrantEvent } from './events/EventSubUserAuthorizationGrantEvent';
import type { EventSubUserAuthorizationRevokeEvent } from './events/EventSubUserAuthorizationRevokeEvent';
import type { EventSubUserUpdateEvent } from './events/EventSubUserUpdateEvent';
import { EventSubChannelAdBreakBeginSubscription } from './subscriptions/EventSubChannelAdBreakBeginSubscription';
import { EventSubChannelBanSubscription } from './subscriptions/EventSubChannelBanSubscription';
import { EventSubChannelCharityCampaignProgressSubscription } from './subscriptions/EventSubChannelCharityCampaignProgressSubscription';
import { EventSubChannelCharityCampaignStartSubscription } from './subscriptions/EventSubChannelCharityCampaignStartSubscription';
import { EventSubChannelCharityCampaignStopSubscription } from './subscriptions/EventSubChannelCharityCampaignStopSubscription';
import { EventSubChannelCharityDonationSubscription } from './subscriptions/EventSubChannelCharityDonationSubscription';
import { EventSubChannelChatClearSubscription } from './subscriptions/EventSubChannelChatClearSubscription';
import { EventSubChannelChatClearUserMessagesSubscription } from './subscriptions/EventSubChannelChatClearUserMessagesSubscription';
import { EventSubChannelChatMessageDeleteSubscription } from './subscriptions/EventSubChannelChatMessageDeleteSubscription';
import { EventSubChannelChatMessageSubscription } from './subscriptions/EventSubChannelChatMessageSubscription';
import { EventSubChannelChatNotificationSubscription } from './subscriptions/EventSubChannelChatNotificationSubscription';
import { EventSubChannelChatSettingsUpdateSubscription } from './subscriptions/EventSubChannelChatSettingsUpdateSubscription';
import { EventSubChannelCheerSubscription } from './subscriptions/EventSubChannelCheerSubscription';
import { EventSubChannelFollowSubscription } from './subscriptions/EventSubChannelFollowSubscription';
import { EventSubChannelGoalBeginSubscription } from './subscriptions/EventSubChannelGoalBeginSubscription';
import { EventSubChannelGoalEndSubscription } from './subscriptions/EventSubChannelGoalEndSubscription';
import { EventSubChannelGoalProgressSubscription } from './subscriptions/EventSubChannelGoalProgressSubscription';
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
import { EventSubChannelAutomaticRewardRedemptionAddSubscription } from './subscriptions/EventSubChannelAutomaticRewardRedemptionAddSubscription';
import { EventSubChannelShieldModeBeginSubscription } from './subscriptions/EventSubChannelShieldModeBeginSubscription';
import { EventSubChannelShieldModeEndSubscription } from './subscriptions/EventSubChannelShieldModeEndSubscription';
import { EventSubChannelShoutoutCreateSubscription } from './subscriptions/EventSubChannelShoutoutCreateSubscription';
import { EventSubChannelShoutoutReceiveSubscription } from './subscriptions/EventSubChannelShoutoutReceiveSubscription';
import { EventSubChannelSubscriptionEndSubscription } from './subscriptions/EventSubChannelSubscriptionEndSubscription';
import { EventSubChannelSubscriptionGiftSubscription } from './subscriptions/EventSubChannelSubscriptionGiftSubscription';
import { EventSubChannelSubscriptionMessageSubscription } from './subscriptions/EventSubChannelSubscriptionMessageSubscription';
import { EventSubChannelSubscriptionSubscription } from './subscriptions/EventSubChannelSubscriptionSubscription';
import { EventSubChannelUnbanRequestCreateSubscription } from './subscriptions/EventSubChannelUnbanRequestCreateSubscription';
import { EventSubChannelUnbanRequestResolveSubscription } from './subscriptions/EventSubChannelUnbanRequestResolveSubscription';
import { EventSubChannelUnbanSubscription } from './subscriptions/EventSubChannelUnbanSubscription';
import { EventSubChannelUpdateSubscription } from './subscriptions/EventSubChannelUpdateSubscription';
import { EventSubDropEntitlementGrantSubscription } from './subscriptions/EventSubDropEntitlementGrantSubscription';
import { EventSubExtensionBitsTransactionCreateSubscription } from './subscriptions/EventSubExtensionBitsTransactionCreateSubscription';
import { EventSubStreamOfflineSubscription } from './subscriptions/EventSubStreamOfflineSubscription';
import { EventSubStreamOnlineSubscription } from './subscriptions/EventSubStreamOnlineSubscription';
import type { EventSubSubscription } from './subscriptions/EventSubSubscription';
import { EventSubUserAuthorizationGrantSubscription } from './subscriptions/EventSubUserAuthorizationGrantSubscription';
import { EventSubUserAuthorizationRevokeSubscription } from './subscriptions/EventSubUserAuthorizationRevokeSubscription';
import { EventSubUserUpdateSubscription } from './subscriptions/EventSubUserUpdateSubscription';

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
	 * Options to pass to the logger.
	 */
	logger?: Partial<LoggerOptions>;
}

/**
 * @private
 * @hideProtected
 */
@rtfm('eventsub-base', 'EventSubBase')
export abstract class EventSubBase extends EventEmitter {
	@Enumerable(false) protected readonly _subscriptions = new Map<string, EventSubSubscription>();
	@Enumerable(false) protected readonly _subscriptionsByTwitchId = new Map<string, EventSubSubscription>();
	@Enumerable(false) protected _twitchSubscriptions = new Map<string, HelixEventSubSubscription>();
	@Enumerable(false) private readonly _seenEventIds = new Set<string>();

	/** @private */ @Enumerable(false) readonly _apiClient: ApiClient;
	/** @private */ readonly _logger: Logger;

	/**
	 * Fires when a subscription is revoked.
	 *
	 * @eventListener
	 *
	 * @param subscription The subscription that was revoked.
	 */
	readonly onRevoke =
		this.registerEvent<[subscription: EventSubSubscription, status: HelixEventSubSubscriptionStatus]>();

	/**
	 * Fires when the client successfully created a subscription.
	 *
	 * @eventListener
	 *
	 * @param subscription The subscription that was successfully created.
	 * @param apiSubscription The subscription data from the API.
	 */
	readonly onSubscriptionCreateSuccess =
		this.registerEvent<[subscription: EventSubSubscription, apiSubscription: HelixEventSubSubscription]>();

	/**
	 * Fires when the client fails to create a subscription.
	 *
	 * @eventListener
	 *
	 * @param subscription The subscription that was not successfully created.
	 * @param error The error that was thrown.
	 */
	readonly onSubscriptionCreateFailure = this.registerEvent<[subscription: EventSubSubscription, error: Error]>();

	/**
	 * Fires when the client successfully deleted a subscription.
	 *
	 * @eventListener
	 *
	 * @param subscription The subscription that was successfully deleted.
	 */
	readonly onSubscriptionDeleteSuccess = this.registerEvent<[subscription: EventSubSubscription]>();

	/**
	 * Fires when the client fails to delete a subscription.
	 *
	 * @eventListener
	 *
	 * @param subscription The subscription that was not successfully deleted.
	 * @param error The error that was thrown.
	 */
	readonly onSubscriptionDeleteFailure = this.registerEvent<[subscription: EventSubSubscription, error: Error]>();

	constructor(config: EventSubBaseConfig) {
		super();

		this._apiClient = config.apiClient;
		this._logger = createLogger({
			name: 'twurple:eventsub',
			...config.logger,
		});
	}

	/** @private */
	_dropSubscription(id: string): void {
		this._subscriptions.delete(id);
	}

	/** @private */
	_dropTwitchSubscription(id: string): void {
		if (this._twitchSubscriptions.has(id)) {
			const data = this._twitchSubscriptions.get(id)!;
			this._twitchSubscriptions.delete(id);
			this._subscriptionsByTwitchId.delete(data.id);
		}
	}

	/** @private */
	_registerTwitchSubscription(subscription: EventSubSubscription, data: HelixEventSubSubscription): void {
		this._twitchSubscriptions.set(subscription.id, data);
		this._subscriptionsByTwitchId.set(data.id, subscription);
		this.emit(this.onSubscriptionCreateSuccess, subscription, data);
	}

	/** @private */
	_notifySubscriptionCreateError(subscription: EventSubSubscription, error: Error): void {
		this.emit(this.onSubscriptionCreateFailure, subscription, error);
	}

	/** @private */
	_notifySubscriptionDeleteSuccess(subscription: EventSubSubscription): void {
		this.emit(this.onSubscriptionDeleteSuccess, subscription);
	}

	/** @private */
	_notifySubscriptionDeleteError(subscription: EventSubSubscription, error: Error): void {
		this.emit(this.onSubscriptionDeleteFailure, subscription, error);
	}

	/**
	 * Subscribes to events representing a stream going live.
	 *
	 * @param user The user for which to get notifications about their streams going live.
	 * @param handler The function that will be called for any new notifications.
	 */
	onStreamOnline(user: UserIdResolvable, handler: (event: EventSubStreamOnlineEvent) => void): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToStreamOnlineEvents');

		return this._genericSubscribe(EventSubStreamOnlineSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events representing a stream going offline.
	 *
	 * @param user The user for which to get notifications about their streams going offline.
	 * @param handler The function that will be called for any new notifications.
	 */
	onStreamOffline(
		user: UserIdResolvable,
		handler: (event: EventSubStreamOfflineEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToStreamOfflineEvents');

		return this._genericSubscribe(EventSubStreamOfflineSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events representing a change in channel metadata, e.g. stream title or category.
	 *
	 * @param user The user for which to get notifications about updates.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelUpdate(
		user: UserIdResolvable,
		handler: (event: EventSubChannelUpdateEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelUpdateEvents');

		return this._genericSubscribe(EventSubChannelUpdateSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user following a channel.
	 *
	 * @param user The user for which to get notifications about their followers.
	 * @param moderator A user that has permission to read followers in the broadcaster's channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelFollow(
		user: UserIdResolvable,
		moderator: UserIdResolvable,
		handler: (event: EventSubChannelFollowEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelFollowEvents');
		const moderatorId = this._extractUserIdWithNumericWarning(moderator, 'subscribeToChannelFollowEvents');
		return this._genericSubscribe(EventSubChannelFollowSubscription, handler, this, userId, moderatorId);
	}

	/**
	 * Subscribes to events that represent a user subscribing to a channel.
	 *
	 * @param user The user for which to get notifications for about their subscribers.
	 * @param handler  The function that will be called for any new notifications.
	 */
	onChannelSubscription(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelSubscriptionEvents');

		return this._genericSubscribe(EventSubChannelSubscriptionSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user gifting a subscription to a channel to someone else.
	 *
	 * @param user The user for which to get notifications for about subscriptions people gift in their channel.
	 * @param handler  The function that will be called for any new notifications.
	 */
	onChannelSubscriptionGift(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionGiftEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelSubscriptionGiftEvents');

		return this._genericSubscribe(EventSubChannelSubscriptionGiftSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user's subscription to a channel being announced.
	 *
	 * @param user The user for which to get notifications for about announced subscriptions.
	 * @param handler  The function that will be called for any new notifications.
	 */
	onChannelSubscriptionMessage(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionMessageEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelSubscriptionMessageEvents');

		return this._genericSubscribe(EventSubChannelSubscriptionMessageSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user's subscription to a channel ending.
	 *
	 * @param user The user for which to get notifications for about ending subscriptions.
	 * @param handler  The function that will be called for any new notifications.
	 */
	onChannelSubscriptionEnd(
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionEndEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelSubscriptionEndEvents');

		return this._genericSubscribe(EventSubChannelSubscriptionEndSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user cheering some bits.
	 *
	 * @param user The user for which to get notifications for about cheers they get.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelCheer(user: UserIdResolvable, handler: (event: EventSubChannelCheerEvent) => void): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelCheerEvents');

		return this._genericSubscribe(EventSubChannelCheerSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a charity campaign starting in a channel.
	 *
	 * @param user The user for which to get notifications about charity campaigns starting.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelCharityCampaignStart(
		user: UserIdResolvable,
		handler: (event: EventSubChannelCharityCampaignStartEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelCharityCampaignStartEvents');

		return this._genericSubscribe(EventSubChannelCharityCampaignStartSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a charity campaign ending in a channel.
	 *
	 * @param user The user for which to get notifications about charity campaigns ending.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelCharityCampaignStop(
		user: UserIdResolvable,
		handler: (event: EventSubChannelCharityCampaignStopEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelCharityCampaignStopEvents');

		return this._genericSubscribe(EventSubChannelCharityCampaignStopSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a donation to a charity campaign in a channel.
	 *
	 * @param user The user for which to get notifications about charity campaign donations.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelCharityDonation(
		user: UserIdResolvable,
		handler: (event: EventSubChannelCharityDonationEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelCharityDonationEvents');

		return this._genericSubscribe(EventSubChannelCharityDonationSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent progress in a charity campaign in a channel.
	 *
	 * @param user The user for which to get notifications about charity campaign progress.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelCharityCampaignProgress(
		user: UserIdResolvable,
		handler: (event: EventSubChannelCharityCampaignProgressEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelCharityCampaignProgressEvents');

		return this._genericSubscribe(EventSubChannelCharityCampaignProgressSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user getting banned from a channel.
	 *
	 * @param user The user for which to get notifications for when users get banned in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelBan(user: UserIdResolvable, handler: (event: EventSubChannelBanEvent) => void): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelBanEvents');

		return this._genericSubscribe(EventSubChannelBanSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user getting unbanned from a channel.
	 *
	 * @param user The user for which to get notifications for when users get unbanned in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelUnban(user: UserIdResolvable, handler: (event: EventSubChannelUnbanEvent) => void): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelUnbanEvents');

		return this._genericSubscribe(EventSubChannelUnbanSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent Shield Mode being activated in a channel.
	 *
	 * @param broadcaster The user for which to get notifications for when Shield Mode is activated in their channel.
	 * @param moderator A user that has permission to read Shield Mode status in the broadcaster's channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelShieldModeBegin(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		handler: (event: EventSubChannelShieldModeBeginEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelShieldModeStartEvents',
		);
		const moderatorId = this._extractUserIdWithNumericWarning(moderator, 'subscribeToChannelShieldModeStartEvents');

		return this._genericSubscribe(
			EventSubChannelShieldModeBeginSubscription,
			handler,
			this,
			broadcasterId,
			moderatorId,
		);
	}

	/**
	 * Subscribes to events that represent Shield Mode being deactivated in a channel.
	 *
	 * @param broadcaster The user for which to get notifications for when Shield Mode is deactivated in their channel.
	 * @param moderator A user that has permission to read Shield Mode status in the broadcaster's channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelShieldModeEnd(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		handler: (event: EventSubChannelShieldModeEndEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelShieldModeEndEvents',
		);
		const moderatorId = this._extractUserIdWithNumericWarning(moderator, 'subscribeToChannelShieldModeEndEvents');

		return this._genericSubscribe(
			EventSubChannelShieldModeEndSubscription,
			handler,
			this,
			broadcasterId,
			moderatorId,
		);
	}

	/**
	 * Subscribes to events that represent a user getting moderator permissions in a channel.
	 *
	 * @param user The user for which to get notifications for when users get moderator permissions in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelModeratorAdd(
		user: UserIdResolvable,
		handler: (event: EventSubChannelModeratorEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelModeratorAddEvents');

		return this._genericSubscribe(EventSubChannelModeratorAddSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a user losing moderator permissions in a channel.
	 *
	 * @param user The user for which to get notifications for when users lose moderator permissions in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelModeratorRemove(
		user: UserIdResolvable,
		handler: (event: EventSubChannelModeratorEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelModeratorRemoveEvents');

		return this._genericSubscribe(EventSubChannelModeratorRemoveSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a broadcaster raiding another broadcaster.
	 *
	 * @param user The broadcaster for which to get outgoing raid notifications.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRaidFrom(
		user: UserIdResolvable,
		handler: (event: EventSubChannelRaidEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelRaidEventsFrom');

		return this._genericSubscribe(EventSubChannelRaidSubscription, handler, this, userId, 'from');
	}

	/**
	 * Subscribes to events that represent a broadcaster being raided by another broadcaster.
	 *
	 * @param user The broadcaster for which to get incoming raid notifications.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRaidTo(user: UserIdResolvable, handler: (event: EventSubChannelRaidEvent) => void): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelRaidEventsTo');

		return this._genericSubscribe(EventSubChannelRaidSubscription, handler, this, userId, 'to');
	}

	/**
	 * Subscribes to events that represent a Channel Points reward being added to a channel.
	 *
	 * @param user The user for which to get notifications for when they add a reward to their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRewardAdd(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelRewardAddEvents');

		return this._genericSubscribe(EventSubChannelRewardAddSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a Channel Points reward being updated.
	 *
	 * @param user The user for which to get notifications for when they update a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRewardUpdate(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToRewardUpdateEvents');

		return this._genericSubscribe(EventSubChannelRewardUpdateSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points reward being updated.
	 *
	 * @param user The user for which to get notifications for when they update the reward.
	 * @param rewardId The ID of the reward for which to get notifications when it is updated.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRewardUpdateForReward(
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRewardEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToRewardUpdateEvents');

		return this._genericSubscribe(EventSubChannelRewardUpdateSubscription, handler, this, userId, rewardId);
	}

	/**
	 * Subscribes to events that represent a Channel Points reward being removed.
	 *
	 * @param user The user for which to get notifications for when they remove a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRewardRemove(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToRewardRemoveEvents');

		return this._genericSubscribe(EventSubChannelRewardRemoveSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points reward being removed.
	 *
	 * @param user The user for which to get notifications for when they remove the reward.
	 * @param rewardId The ID of the reward to get notifications for when it is removed.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRewardRemoveForReward(
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRewardEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToRewardRemoveEventsForReward');

		return this._genericSubscribe(EventSubChannelRewardRemoveSubscription, handler, this, userId, rewardId);
	}

	/**
	 * Subscribes to events that represents a Channel Points reward being redeemed.
	 *
	 * @param user The user for which to get notifications for when their rewards are redeemed.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRedemptionAdd(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRedemptionAddEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelRedemptionEvents');

		return this._genericSubscribe(EventSubChannelRedemptionAddSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points reward being redeemed.
	 *
	 * @param user The user for which to get notifications when their reward is redeemed.
	 * @param rewardId The ID of the reward for which to get notifications when it is redeemed.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRedemptionAddForReward(
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRedemptionAddEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToRedemptionAddEventsForReward');

		return this._genericSubscribe(EventSubChannelRedemptionAddSubscription, handler, this, userId, rewardId);
	}

	/**
	 * Subscribes to events that represent a Channel Points reward being updated by a broadcaster.
	 *
	 * @param user The user for which to get notifications for when they update a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRedemptionUpdate(
		user: UserIdResolvable,
		handler: (data: EventSubChannelRedemptionUpdateEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelRedemptionUpdateEvents');

		return this._genericSubscribe(EventSubChannelRedemptionUpdateSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points reward being updated by a broadcaster.
	 *
	 * @param user The user for which to get notifications for when they update the reward.
	 * @param rewardId The ID of the reward for which to get notifications when it gets updated.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelRedemptionUpdateForReward(
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRedemptionUpdateEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelRedemptionUpdateEventsForReward');

		return this._genericSubscribe(EventSubChannelRedemptionUpdateSubscription, handler, this, userId, rewardId);
	}

	/**
	 * Subscribes to events that represent a specific Channel Points automatic reward being redeemed.
	 *
	 * @param user The user for which to get notifications when their automatic reward is redeemed.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelAutomaticRewardRedemptionAdd(
		user: UserIdResolvable,
		handler: (data: EventSubChannelAutomaticRewardRedemptionAddEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'onChannelAutomaticRewardRedemptionAdd');

		return this._genericSubscribe(EventSubChannelAutomaticRewardRedemptionAddSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a poll starting in a channel.
	 *
	 * @param user The broadcaster for which to receive poll begin events.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelPollBegin(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollBeginEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelPollBeginEvents');

		return this._genericSubscribe(EventSubChannelPollBeginSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a poll being voted on in a channel.
	 *
	 * @param user The broadcaster for which to receive poll progress events.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelPollProgress(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollProgressEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelPollProgressEvents');

		return this._genericSubscribe(EventSubChannelPollProgressSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a poll ending in a channel.
	 *
	 * @param user The broadcaster for which to receive poll end events.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelPollEnd(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollEndEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelPollEndEvents');

		return this._genericSubscribe(EventSubChannelPollEndSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a prediction starting in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction begin events.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelPredictionBegin(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionBeginEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelPredictionBeginEvents');

		return this._genericSubscribe(EventSubChannelPredictionBeginSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a prediction being voted on in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction progress events.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelPredictionProgress(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionProgressEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelPredictionProgressEvents');

		return this._genericSubscribe(EventSubChannelPredictionProgressSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a prediction being locked in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction lock events.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelPredictionLock(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionLockEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelPredictionLockEvents');

		return this._genericSubscribe(EventSubChannelPredictionLockSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a prediction ending in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction end events.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelPredictionEnd(
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionEndEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelPredictionEndEvents');

		return this._genericSubscribe(EventSubChannelPredictionEndSubscription, handler, this, broadcasterId);
	}

	/**
	 * Subscribes to events that represent a Goal beginning.
	 *
	 * @param user The user for which to get notifications about Goals in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelGoalBegin(
		user: UserIdResolvable,
		handler: (data: EventSubChannelGoalBeginEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelGoalBeginEvents');

		return this._genericSubscribe(EventSubChannelGoalBeginSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent progress in a Goal in a channel.
	 *
	 * @param user The user for which to get notifications about Goals in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelGoalProgress(
		user: UserIdResolvable,
		handler: (data: EventSubChannelGoalProgressEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelGoalProgressEvents');

		return this._genericSubscribe(EventSubChannelGoalProgressSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent the end of a Goal in a channel.
	 *
	 * @param user The user for which to get notifications about Goals in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelGoalEnd(
		user: UserIdResolvable,
		handler: (data: EventSubChannelGoalEndEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelGoalEndEvents');

		return this._genericSubscribe(EventSubChannelGoalEndSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a Hype Train beginning.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelHypeTrainBegin(
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainBeginEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelHypeTrainBeginEvents');

		return this._genericSubscribe(EventSubChannelHypeTrainBeginSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent progress in a Hype Train in a channel.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelHypeTrainProgress(
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainProgressEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelHypeTrainProgressEvents');

		return this._genericSubscribe(EventSubChannelHypeTrainProgressSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent the end of a Hype Train in a channel.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelHypeTrainEnd(
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainEndEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelHypeTrainEndEvents');

		return this._genericSubscribe(EventSubChannelHypeTrainEndSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent a broadcaster shouting out another broadcaster.
	 *
	 * @param broadcaster The broadcaster for which you want to listen to outgoing shoutout events.
	 * @param moderator A user that has permission to see or manage shoutout events in the broadcaster's channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelShoutoutCreate(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		handler: (event: EventSubChannelShoutoutCreateEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelShoutoutCreateEvents',
		);
		const moderatorId = this._extractUserIdWithNumericWarning(moderator, 'subscribeToChannelShoutoutCreateEvents');

		return this._genericSubscribe(
			EventSubChannelShoutoutCreateSubscription,
			handler,
			this,
			broadcasterId,
			moderatorId,
		);
	}

	/**
	 * Subscribes to events that represent a broadcaster being shouted out by another broadcaster.
	 *
	 * @param broadcaster The broadcaster for which you want to listen to incoming shoutout events.
	 * @param moderator A user that has permission to see or manage shoutout events in the broadcaster's channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelShoutoutReceive(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		handler: (event: EventSubChannelShoutoutReceiveEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelShoutoutReceiveEvents',
		);
		const moderatorId = this._extractUserIdWithNumericWarning(moderator, 'subscribeToChannelShoutoutReceiveEvents');

		return this._genericSubscribe(
			EventSubChannelShoutoutReceiveSubscription,
			handler,
			this,
			broadcasterId,
			moderatorId,
		);
	}

	/**
	 * Subscribes to events that represent an ad break beginning.
	 *
	 * @param user The user for which to get notifications about ad breaks in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelAdBreakBegin(
		user: UserIdResolvable,
		handler: (data: EventSubChannelAdBreakBeginEvent) => void,
	): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelAdBreakBeginEvents');

		return this._genericSubscribe(EventSubChannelAdBreakBeginSubscription, handler, this, userId);
	}

	/**
	 * Subscribes to events that represent an channel's chat being cleared.
	 *
	 * @param broadcaster The user for which to get notifications about chat being cleared in their channel.
	 * @param user The user to use for reading the channel's chat.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelChatClear(
		broadcaster: UserIdResolvable,
		user: UserIdResolvable,
		handler: (data: EventSubChannelChatClearEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(broadcaster, 'subscribeToChannelChatClearEvents');
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelChatClearEvents');

		return this._genericSubscribe(EventSubChannelChatClearSubscription, handler, this, broadcasterId, userId);
	}

	/**
	 * Subscribes to events that represent a user's chat messages being cleared in a channel.
	 *
	 * @param broadcaster The user for which to get notifications about a user's chat messages being cleared in their channel.
	 * @param user The user to use for reading the channel's chat.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelChatClearUserMessages(
		broadcaster: UserIdResolvable,
		user: UserIdResolvable,
		handler: (data: EventSubChannelChatClearUserMessagesEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelChatClearUserMessagesEvents',
		);
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelChatClearUserMessagesEvents');

		return this._genericSubscribe(
			EventSubChannelChatClearUserMessagesSubscription,
			handler,
			this,
			broadcasterId,
			userId,
		);
	}

	/**
	 * Subscribes to events that represent a chat message being deleted in a channel.
	 *
	 * @param broadcaster The user for which to get notifications about a chat message being deleted in their channel.
	 * @param user The user to use for reading the channel's chat.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelChatMessageDelete(
		broadcaster: UserIdResolvable,
		user: UserIdResolvable,
		handler: (data: EventSubChannelChatMessageDeleteEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelChatMessageDeleteEvents',
		);
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelChatMessageDeleteEvents');

		return this._genericSubscribe(
			EventSubChannelChatMessageDeleteSubscription,
			handler,
			this,
			broadcasterId,
			userId,
		);
	}

	/**
	 * Subscribes to events that represent a chat notification being sent to a channel.
	 *
	 * @param broadcaster The user for which to get chat notifications in their channel.
	 * @param user The user to use for reading the channel's chat.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelChatNotification(
		broadcaster: UserIdResolvable,
		user: UserIdResolvable,
		handler: (data: EventSubChannelChatNotificationEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelChatNotificationEvents',
		);
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelChatNotificationEvents');

		return this._genericSubscribe(
			EventSubChannelChatNotificationSubscription,
			handler,
			this,
			broadcasterId,
			userId,
		);
	}

	/**
	 * Subscribes to events that represent a chat message being sent to a channel.
	 *
	 * @param broadcaster The user for which to get chat message notifications in their channel.
	 * @param user The user to use for reading the channel's chat.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelChatMessage(
		broadcaster: UserIdResolvable,
		user: UserIdResolvable,
		handler: (data: EventSubChannelChatMessageEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelChatMessageDeleteEvents',
		);
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelChatMessageEvents');

		return this._genericSubscribe(EventSubChannelChatMessageSubscription, handler, this, broadcasterId, userId);
	}

	/**
	 * Subscribes to events that represent chat settings being updated in a channel.
	 *
	 * @param broadcaster The user for which to get notifications about chat settings being updated in their channel.
	 * @param user The user to use for reading the channel's chat.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelChatSettingsUpdate(
		broadcaster: UserIdResolvable,
		user: UserIdResolvable,
		handler: (data: EventSubChannelChatSettingsUpdateEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelChatSettingsUpdateEvents',
		);
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToChannelChatSettingsUpdateEvents');

		return this._genericSubscribe(
			EventSubChannelChatSettingsUpdateSubscription,
			handler,
			this,
			broadcasterId,
			userId,
		);
	}

	/**
	 * Subscribes to events that represent an unban request being created.
	 *
	 * @param broadcaster The user for which to get notifications about unban requests being created in their channel.
	 * @param moderator A user that has permission to read unban requests in the broadcaster's channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelUnbanRequestCreate(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		handler: (data: EventSubChannelUnbanRequestCreateEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelUnbanRequestCreateEvents',
		);
		const moderatorId = this._extractUserIdWithNumericWarning(
			moderator,
			'subscribeToChannelUnbanRequestCreateEvents',
		);

		return this._genericSubscribe(
			EventSubChannelUnbanRequestCreateSubscription,
			handler,
			this,
			broadcasterId,
			moderatorId,
		);
	}

	/**
	 * Subscribes to events that represent an unban request being resolved.
	 *
	 * @param broadcaster The user for which to get notifications about unban requests being resolved in their channel.
	 * @param moderator A user that has permission to read unban requests in the broadcaster's channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	onChannelUnbanRequestResolve(
		broadcaster: UserIdResolvable,
		moderator: UserIdResolvable,
		handler: (data: EventSubChannelUnbanRequestResolveEvent) => void,
	): EventSubSubscription {
		const broadcasterId = this._extractUserIdWithNumericWarning(
			broadcaster,
			'subscribeToChannelUnbanRequestResolveEvents',
		);
		const moderatorId = this._extractUserIdWithNumericWarning(
			moderator,
			'subscribeToChannelUnbanRequestResolveEvents',
		);

		return this._genericSubscribe(
			EventSubChannelUnbanRequestResolveSubscription,
			handler,
			this,
			broadcasterId,
			moderatorId,
		);
	}

	/**
	 * Subscribes to events that represent a drop entitlement being granted.
	 *
	 * @param filter The filter to apply for the events.
	 * @param handler The function that will be called for any new notifications.
	 */
	onDropEntitlementGrant(
		filter: HelixEventSubDropEntitlementGrantFilter,
		handler: (event: EventSubDropEntitlementGrantEvent) => void,
	): EventSubSubscription {
		return this._genericSubscribe(EventSubDropEntitlementGrantSubscription, handler, this, filter);
	}

	/**
	 * Subscribes to events that represent a Bits transaction in an extension.
	 *
	 * @param handler  The function that will be called for any new notifications.
	 */
	onExtensionBitsTransactionCreate(
		handler: (event: EventSubExtensionBitsTransactionCreateEvent) => void,
	): EventSubSubscription {
		const { clientId } = this._apiClient._authProvider;
		return this._genericSubscribe(EventSubExtensionBitsTransactionCreateSubscription, handler, this, clientId);
	}

	/**
	 * Subscribes to events that represent a user granting authorization to an application.
	 *
	 * @param handler The function that will be called for any new notifications.
	 */
	onUserAuthorizationGrant(handler: (data: EventSubUserAuthorizationGrantEvent) => void): EventSubSubscription {
		const { clientId } = this._apiClient._authProvider;
		return this._genericSubscribe(EventSubUserAuthorizationGrantSubscription, handler, this, clientId);
	}

	/**
	 * Subscribes to events that represent a user revoking authorization from an application.
	 *
	 * @param handler The function that will be called for any new notifications.
	 */
	onUserAuthorizationRevoke(handler: (data: EventSubUserAuthorizationRevokeEvent) => void): EventSubSubscription {
		const { clientId } = this._apiClient._authProvider;
		return this._genericSubscribe(EventSubUserAuthorizationRevokeSubscription, handler, this, clientId);
	}

	/**
	 * Subscribes to events that represent a user updating their account details.
	 *
	 * @param user The user for which to get notifications about account updates.
	 * @param handler The function that will be called for any new notifications.
	 */
	onUserUpdate(user: UserIdResolvable, handler: (data: EventSubUserUpdateEvent) => void): EventSubSubscription {
		const userId = this._extractUserIdWithNumericWarning(user, 'subscribeToUserUpdateEvents');

		return this._genericSubscribe(EventSubUserUpdateSubscription, handler, this, userId);
	}

	/** @private */
	abstract _getTransportOptionsForSubscription(
		subscription: EventSubSubscription,
	): Promise<HelixEventSubTransportOptions>;

	/** @private */
	abstract _getCliTestCommandForSubscription(subscription: EventSubSubscription): Promise<string>;

	/** @private */
	abstract _isReadyToSubscribe(subscription: EventSubSubscription): boolean;

	/** @private */
	_getCorrectSubscriptionByTwitchId(id: string): EventSubSubscription | undefined {
		return this._subscriptionsByTwitchId.get(id);
	}

	/** @private */
	_handleSingleEventPayload(
		subscription: EventSubSubscription,
		payload: Record<string, unknown>,
		messageId: string,
	): void {
		if (this._seenEventIds.has(messageId)) {
			this._logger.debug(`Duplicate notification prevented for event: ${subscription.id}`);
			return;
		}
		this._seenEventIds.add(messageId);
		setTimeout(() => this._seenEventIds.delete(messageId), 10 * 60 * 1000);
		subscription._handleData(payload).catch(e => {
			this._logger.error(
				`Caught an unhandled error in EventSub event handler for subscription ${subscription.id}.
You should probably add try-catch to your handler to be able to examine it further.

Message: ${(e as Error | undefined)?.message ?? e}`,
			);
		});
	}

	protected abstract _findTwitchSubscriptionToContinue(
		subscription: EventSubSubscription,
	): HelixEventSubSubscription | undefined;

	protected _genericSubscribe<T, Args extends unknown[]>(
		clazz: new (
			handler: (obj: T) => void | Promise<void>,
			client: EventSubBase,
			...args: Args
		) => EventSubSubscription<T>,
		handler: (obj: T) => void,
		client: EventSubBase,
		...params: Args
	): EventSubSubscription {
		const subscription = new clazz(handler, client, ...params) as EventSubSubscription;
		if (this._isReadyToSubscribe(subscription)) {
			subscription.start(this._findTwitchSubscriptionToContinue(subscription));
		}
		this._subscriptions.set(subscription.id, subscription);

		return subscription;
	}

	private _extractUserIdWithNumericWarning(user: UserIdResolvable, methodName: string) {
		const userId = extractUserId(user);
		if (!numberRegex.test(userId)) {
			this._logger.warn(
				`${methodName}: The given user is a non-numeric string. You might be sending a user name instead of a user ID.`,
			);
		}

		return userId;
	}
}
