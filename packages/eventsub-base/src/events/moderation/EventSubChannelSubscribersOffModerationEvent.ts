import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';

/**
 * An EventSub event representing a moderator disabling subscribers-only mode on a channel.
 */
@rtfm<EventSubChannelSubscribersOffModerationEvent>(
	'eventsub-base',
	'EventSubChannelSubscribersOffModerationEvent',
	'broadcasterId',
)
export class EventSubChannelSubscribersOffModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'subscribersoff' as const;
}
