import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import { type EventSubChannelChatUnraidNotificationEventData } from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a notification for cancelling an outgoing raid in a channel's chat.
 */
@rtfm<EventSubChannelChatUnraidNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatUnraidNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatUnraidNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatUnraidNotificationEventData;

	readonly type = 'unraid';
}
