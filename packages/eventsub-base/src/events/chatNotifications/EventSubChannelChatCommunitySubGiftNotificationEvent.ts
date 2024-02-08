import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import {
	type EventSubChannelChatCommunitySubGiftNotificationEventData,
	type EventSubChannelChatNotificationSubTier,
} from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a community sub gift notification in a channel's chat.
 */
@rtfm<EventSubChannelChatCommunitySubGiftNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatCommunitySubGiftNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatCommunitySubGiftNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatCommunitySubGiftNotificationEventData;

	readonly type = 'community_sub_gift';

	/**
	 * The ID of the community sub gift.
	 */
	get id(): string {
		return this[rawDataSymbol].community_sub_gift.id;
	}

	/**
	 * The tier of the subscriptions.
	 */
	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].community_sub_gift.sub_tier;
	}

	/**
	 * The amount of gifts that are part of this community sub gift.
	 */
	get amount(): number | null {
		return this[rawDataSymbol].community_sub_gift.total;
	}

	/**
	 * The amount of gifts that the gifter has sent in total, or `null` the gift is anonymous.
	 */
	get cumulativeAmount(): number | null {
		return this[rawDataSymbol].community_sub_gift.cumulative_total;
	}
}
