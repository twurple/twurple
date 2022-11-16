import type { UserIdResolvable } from '@twurple/common';
import type { EventSubChannelBanEvent } from './events/EventSubChannelBanEvent';
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
import type { EventSubChannelSubscriptionEndEvent } from './events/EventSubChannelSubscriptionEndEvent';
import type { EventSubChannelSubscriptionEvent } from './events/EventSubChannelSubscriptionEvent';
import type { EventSubChannelSubscriptionGiftEvent } from './events/EventSubChannelSubscriptionGiftEvent';
import type { EventSubChannelSubscriptionMessageEvent } from './events/EventSubChannelSubscriptionMessageEvent';
import type { EventSubChannelUnbanEvent } from './events/EventSubChannelUnbanEvent';
import type { EventSubChannelUpdateEvent } from './events/EventSubChannelUpdateEvent';
import type { EventSubExtensionBitsTransactionCreateEvent } from './events/EventSubExtensionBitsTransactionCreateEvent';
import type { EventSubStreamOfflineEvent } from './events/EventSubStreamOfflineEvent';
import type { EventSubStreamOnlineEvent } from './events/EventSubStreamOnlineEvent';
import type { EventSubUserAuthorizationGrantEvent } from './events/EventSubUserAuthorizationGrantEvent';
import type { EventSubUserAuthorizationRevokeEvent } from './events/EventSubUserAuthorizationRevokeEvent';
import type { EventSubUserUpdateEvent } from './events/EventSubUserUpdateEvent';
import type { EventSubSubscription } from './subscriptions/EventSubSubscription';

/**
 * The common interface of all EventSub listeners.
 */
export interface EventSubListener {
	/**
	 * Start the listener.
	 */
	start: () => Promise<void>;

	/**
	 * Stop the listener.
	 */
	stop: () => Promise<void>;

	/**
	 * Subscribes to events representing a stream going live.
	 *
	 * @param user The user for which to get notifications about their streams going live.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToStreamOnlineEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubStreamOnlineEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events representing a stream going offline.
	 *
	 * @param user The user for which to get notifications about their streams going offline.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToStreamOfflineEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubStreamOfflineEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events representing a change in channel metadata, e.g. stream title or category.
	 *
	 * @param user The user for which to get notifications about updates.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelUpdateEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelUpdateEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user following a channel.
	 *
	 * @param user The user for which to get notifications about their followers.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelFollowEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelFollowEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user subscribing to a channel.
	 *
	 * @param user The user for which to get notifications for about their subscribers.
	 * @param handler  The function that will be called for any new notifications.
	 */
	subscribeToChannelSubscriptionEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user gifting a subscription to a channel to someone else.
	 *
	 * @param user The user for which to get notifications for about subscriptions people gift in their channel.
	 * @param handler  The function that will be called for any new notifications.
	 */
	subscribeToChannelSubscriptionGiftEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionGiftEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user's subscription to a channel being announced.
	 *
	 * @param user The user for which to get notifications for about announced subscriptions.
	 * @param handler  The function that will be called for any new notifications.
	 */
	subscribeToChannelSubscriptionMessageEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionMessageEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user's subscription to a channel ending.
	 *
	 * @param user The user for which to get notifications for about ending subscriptions.
	 * @param handler  The function that will be called for any new notifications.
	 */
	subscribeToChannelSubscriptionEndEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelSubscriptionEndEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user cheering some bits.
	 *
	 * @param user The user for which to get notifications for about cheers they get.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelCheerEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelCheerEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user getting banned from a channel.
	 *
	 * @param user The user for which to get notifications for when users get banned in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelBanEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelBanEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user getting unbanned from a channel.
	 *
	 * @param user The user for which to get notifications for when users get unbanned in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelUnbanEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelUnbanEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user getting moderator permissions in a channel.
	 *
	 * @param user The user for which to get notifications for when users get moderator permissions in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelModeratorAddEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelModeratorEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user losing moderator permissions in a channel.
	 *
	 * @param user The user for which to get notifications for when users lose moderator permissions in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelModeratorRemoveEvents: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelModeratorEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a broadcaster raiding another broadcaster.
	 *
	 * @param user The broadcaster for which to get outgoing raid notifications.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRaidEventsFrom: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelRaidEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a broadcaster being raided by another broadcaster.
	 *
	 * @param user The broadcaster for which to get incoming raid notifications.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRaidEventsTo: (
		user: UserIdResolvable,
		handler: (event: EventSubChannelRaidEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a Channel Points reward being added to a channel.
	 *
	 * @param user The user for which to get notifications for when they add a reward to their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRewardAddEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a Channel Points reward being updated.
	 *
	 * @param user The user for which to get notifications for when they update a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRewardUpdateEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a specific Channel Points reward being updated.
	 *
	 * @param user The user for which to get notifications for when they update the reward.
	 * @param rewardId The ID of the reward for which to get notifications when it is updated.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRewardUpdateEventsForReward: (
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRewardEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a Channel Points reward being removed.
	 *
	 * @param user The user for which to get notifications for when they remove a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRewardRemoveEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelRewardEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a specific Channel Points reward being removed.
	 *
	 * @param user The user for which to get notifications for when they remove the reward.
	 * @param rewardId The ID of the reward to get notifications for when it is removed.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRewardRemoveEventsForReward: (
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRewardEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represents a Channel Points reward being redeemed.
	 *
	 * @param user The user for which to get notifications for when their rewards are redeemed.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRedemptionAddEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelRedemptionAddEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a specific Channel Points reward being redeemed.
	 *
	 * @param user The user for which to get notifications when their reward is redeemed.
	 * @param rewardId The ID of the reward for which to get notifications when it is redeemed.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRedemptionAddEventsForReward: (
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRedemptionAddEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a Channel Points reward being updated by a broadcaster.
	 *
	 * @param user The user for which to get notifications for when they update a reward.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRedemptionUpdateEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelRedemptionUpdateEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a specific Channel Points reward being updated by a broadcaster.
	 *
	 * @param user The user for which to get notifications for when they update the reward.
	 * @param rewardId The ID of the reward for which to get notifications when it gets updated.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelRedemptionUpdateEventsForReward: (
		user: UserIdResolvable,
		rewardId: string,
		handler: (data: EventSubChannelRedemptionUpdateEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a poll starting in a channel.
	 *
	 * @param user The broadcaster for which to receive poll begin events.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelPollBeginEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollBeginEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a poll being voted on in a channel.
	 *
	 * @param user The broadcaster for which to receive poll progress events.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelPollProgressEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollProgressEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a poll ending in a channel.
	 *
	 * @param user The broadcaster for which to receive poll end events.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelPollEndEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelPollEndEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a prediction starting in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction begin events.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelPredictionBeginEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionBeginEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a prediction being voted on in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction progress events.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelPredictionProgressEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionProgressEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a prediction being locked in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction lock events.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelPredictionLockEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionLockEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a prediction ending in a channel.
	 *
	 * @param user The broadcaster for which to receive prediction end events.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelPredictionEndEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelPredictionEndEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a Goal beginning.
	 *
	 * @param user The user for which to get notifications about Goals in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelGoalBeginEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelGoalBeginEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent progress in a Goal in a channel.
	 *
	 * @param user The user for which to get notifications about Goals in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelGoalProgressEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelGoalProgressEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent the end of a Goal in a channel.
	 *
	 * @param user The user for which to get notifications about Goals in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelGoalEndEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelGoalEndEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a Hype Train beginning.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelHypeTrainBeginEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainBeginEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent progress in a Hype Train in a channel.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelHypeTrainProgressEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainProgressEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent the end of a Hype Train in a channel.
	 *
	 * @param user The user for which to get notifications about Hype Trains in their channel.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToChannelHypeTrainEndEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubChannelHypeTrainEndEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a Bits transaction in an extension.
	 *
	 * @param clientId The Client ID of the extension for which to get notifications for about Bits transactions.
	 * @param handler  The function that will be called for any new notifications.
	 */
	subscribeToExtensionBitsTransactionCreateEvents: (
		clientId: string,
		handler: (event: EventSubExtensionBitsTransactionCreateEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user granting authorization to an application.
	 *
	 * @param clientId The Client ID for which to get notifications about authorization grants.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToUserAuthorizationGrantEvents: (
		clientId: string,
		handler: (data: EventSubUserAuthorizationGrantEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user revoking authorization from an application.
	 *
	 * @param clientId The Client ID for which to get notifications about authorization revocations.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToUserAuthorizationRevokeEvents: (
		clientId: string,
		handler: (data: EventSubUserAuthorizationRevokeEvent) => void
	) => Promise<EventSubSubscription>;

	/**
	 * Subscribes to events that represent a user updating their account details.
	 *
	 * @param user The user for which to get notifications about account updates.
	 * @param handler The function that will be called for any new notifications.
	 */
	subscribeToUserUpdateEvents: (
		user: UserIdResolvable,
		handler: (data: EventSubUserUpdateEvent) => void
	) => Promise<EventSubSubscription>;
}
