import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';

/**
 * An EventSub event representing a moderator disabling slow mode on a channel.
 */
@rtfm<EventSubChannelSlowOffModerationEvent>('eventsub-base', 'EventSubChannelSlowOffModerationEvent', 'broadcasterId')
export class EventSubChannelSlowOffModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'slowoff';
}
