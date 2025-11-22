import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import {
	type EventSubChannelChatNotificationSubTier,
	type EventSubChannelChatSharedChatCommunitySubGiftNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a community sub gift notification in another channel's chat during a shared chat
 * session.
 */
@rtfm<EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSharedChatCommunitySubGiftNotificationEventData;

	readonly type = 'shared_chat_community_sub_gift' as const;

	/**
	 * The ID of the community sub gift.
	 */
	get id(): string {
		return this[rawDataSymbol].shared_chat_community_sub_gift.id;
	}

	/**
	 * The tier of the subscriptions.
	 */
	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].shared_chat_community_sub_gift.sub_tier;
	}

	/**
	 * The amount of gifts that are part of this community sub gift.
	 */
	get amount(): number {
		return this[rawDataSymbol].shared_chat_community_sub_gift.total;
	}

	/**
	 * The amount of gifts that the gifter has sent in total, or `null` the gift is anonymous.
	 */
	get cumulativeAmount(): number | null {
		return this[rawDataSymbol].shared_chat_community_sub_gift.cumulative_total;
	}
}
