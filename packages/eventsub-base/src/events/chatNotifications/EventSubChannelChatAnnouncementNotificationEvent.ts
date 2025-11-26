import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent.js';
import {
	type EventSubChannelChatAnnouncementColor,
	type EventSubChannelChatAnnouncementNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external.js';

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

	readonly type = 'announcement' as const;

	/**
	 * The color of the announcement.
	 */
	get announcementColor(): EventSubChannelChatAnnouncementColor {
		return this[rawDataSymbol].announcement.color;
	}
}
