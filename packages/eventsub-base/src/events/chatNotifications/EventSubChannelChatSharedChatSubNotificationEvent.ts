import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent.js';
import {
	type EventSubChannelChatNotificationSubTier,
	type EventSubChannelChatSharedChatSubNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external.js';

/**
 * An EventSub event representing a sub notification in another channel's chat during a shared chat session.
 */
@rtfm<EventSubChannelChatSharedChatSubNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSharedChatSubNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSharedChatSubNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSharedChatSubNotificationEventData;

	readonly type = 'shared_chat_sub' as const;

	/**
	 * The tier of the subscription.
	 */
	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].shared_chat_sub.sub_tier;
	}

	/**
	 * Whether the subscription was "paid" for using Prime Gaming.
	 */
	get isPrime(): boolean {
		return this[rawDataSymbol].shared_chat_sub.is_prime;
	}

	/**
	 * The number of months the subscription is for.
	 */
	get durationMonths(): number {
		return this[rawDataSymbol].shared_chat_sub.duration_months;
	}
}
