import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';

/**
 * An EventSub event representing a moderator clearing the chat on a channel.
 */
@rtfm<EventSubChannelClearModerationEvent>('eventsub-base', 'EventSubChannelClearModerationEvent', 'broadcasterId')
export class EventSubChannelClearModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'clear' as const;
}
