import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';

/**
 * An EventSub event representing a moderator disabling emote-only mode on a channel.
 */
@rtfm<EventSubChannelEmoteOnlyOffModerationEvent>(
	'eventsub-base',
	'EventSubChannelEmoteOnlyOffModerationEvent',
	'broadcasterId',
)
export class EventSubChannelEmoteOnlyOffModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'emoteonlyoff' as const;
}
