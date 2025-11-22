import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';

/**
 * An EventSub event representing a moderator disabling followers-only mode on a channel.
 */
@rtfm<EventSubChannelFollowersOffModerationEvent>(
	'eventsub-base',
	'EventSubChannelFollowersOffModerationEvent',
	'broadcasterId',
)
export class EventSubChannelFollowersOffModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'followersoff' as const;
}
