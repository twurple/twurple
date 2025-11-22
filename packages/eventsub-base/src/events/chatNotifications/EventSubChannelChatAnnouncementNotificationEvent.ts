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

	readonly type = 'announcement' as const;

	/**
	 * The color of the announcement.
	 *
	 * @deprecated Use `announcementColor` instead.
	 * In the next major release, this property will not override the base `color` property anymore.
	 * As such, you will be able to use `color` to get the chat color of the user again.
	 */
	get color(): EventSubChannelChatAnnouncementColor {
		return this[rawDataSymbol].announcement.color;
	}

	/**
	 * The color of the announcement.
	 */
	get announcementColor(): EventSubChannelChatAnnouncementColor {
		return this[rawDataSymbol].announcement.color;
	}
}
