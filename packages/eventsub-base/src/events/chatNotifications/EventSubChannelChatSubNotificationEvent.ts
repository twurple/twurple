import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import {
	type EventSubChannelChatNotificationSubTier,
	type EventSubChannelChatSubNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a sub notification in a channel's chat.
 */
@rtfm<EventSubChannelChatSubNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatResubNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSubNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSubNotificationEventData;

	readonly type = 'sub';

	/**
	 * The tier of the subscription.
	 */
	get tier(): EventSubChannelChatNotificationSubTier {
		return this[rawDataSymbol].sub.sub_tier;
	}

	/**
	 * Whether the subscription was "paid" for using Prime Gaming.
	 */
	get isPrime(): boolean {
		return this[rawDataSymbol].sub.is_prime;
	}

	/**
	 * The number of months the subscription is for.
	 */
	get durationMonths(): number {
		return this[rawDataSymbol].sub.duration_months;
	}
}
