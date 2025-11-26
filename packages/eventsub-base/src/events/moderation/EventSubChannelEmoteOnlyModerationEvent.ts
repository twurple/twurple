import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';

/**
 * An EventSub event representing a moderator enabling emote-only mode on a channel.
 */
@rtfm<EventSubChannelEmoteOnlyModerationEvent>(
	'eventsub-base',
	'EventSubChannelEmoteOnlyModerationEvent',
	'broadcasterId',
)
export class EventSubChannelEmoteOnlyModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'emoteonly' as const;
}
