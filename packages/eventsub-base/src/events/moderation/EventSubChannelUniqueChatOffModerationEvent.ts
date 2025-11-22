import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';

/**
 * An EventSub event representing a moderator disabling unique chat mode on a channel.
 */
@rtfm<EventSubChannelUniqueChatOffModerationEvent>(
	'eventsub-base',
	'EventSubChannelUniqueChatOffModerationEvent',
	'broadcasterId',
)
export class EventSubChannelUniqueChatOffModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'uniquechatoff' as const;
}
