import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';

/**
 * An EventSub event representing a moderator enabling unique chat mode on a channel.
 */
@rtfm<EventSubChannelUniqueChatModerationEvent>(
	'eventsub-base',
	'EventSubChannelUniqueChatModerationEvent',
	'broadcasterId',
)
export class EventSubChannelUniqueChatModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'uniquechat' as const;
}
