import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent';
import {
	type EventSubChannelChatAnnouncementColor,
	type EventSubChannelChatAnnouncementNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external';

/**
 * An EventSub event representing a notification for an announcement in a channel's chat.
 */
@rtfm<EventSubChannelChatAnnouncementNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatAnnouncementNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatAnnouncementNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatAnnouncementNotificationEventData;

	readonly type = 'announcement';

	/**
	 * The color of the announcement.
	 */
	get color(): EventSubChannelChatAnnouncementColor {
		return this[rawDataSymbol].announcement.color;
	}
}
