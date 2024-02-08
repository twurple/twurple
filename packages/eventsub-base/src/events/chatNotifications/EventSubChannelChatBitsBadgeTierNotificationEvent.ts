import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import { type EventSubChannelChatBitsBadgeTierNotificationEventData } from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a notification for a new bits badge tier being reached in a channel's chat.
 */
@rtfm<EventSubChannelChatBitsBadgeTierNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatBitsBadgeTierNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatBitsBadgeTierNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatBitsBadgeTierNotificationEventData;

	readonly type = 'bits_badge_tier';

	/**
	 * The new bits badge tier that was just reached.
	 */
	get newTier(): number {
		return this[rawDataSymbol].bits_badge_tier.tier;
	}
}
