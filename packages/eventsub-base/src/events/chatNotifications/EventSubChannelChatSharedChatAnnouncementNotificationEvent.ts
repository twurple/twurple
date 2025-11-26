import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent.js';
import {
	type EventSubChannelChatAnnouncementColor,
	type EventSubChannelChatSharedChatAnnouncementNotificationEventData,
} from './EventSubChannelChatNotificationEvent.external.js';

/**
 * An EventSub event representing a notification for an announcement in another channel's chat during a shared chat
 * session.
 */
@rtfm<EventSubChannelChatSharedChatAnnouncementNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatSharedChatAnnouncementNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatSharedChatAnnouncementNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatSharedChatAnnouncementNotificationEventData;

	readonly type = 'shared_chat_announcement' as const;

	/**
	 * The color of the announcement.
	 */
	get color(): EventSubChannelChatAnnouncementColor {
		return this[rawDataSymbol].shared_chat_announcement.color;
	}
}
