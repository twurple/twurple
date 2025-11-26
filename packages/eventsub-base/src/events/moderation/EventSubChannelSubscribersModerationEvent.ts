import { rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';

/**
 * An EventSub event representing a moderator enabling subscribers-only mode on a channel.
 */
@rtfm<EventSubChannelSubscribersModerationEvent>(
	'eventsub-base',
	'EventSubChannelSubscribersModerationEvent',
	'broadcasterId',
)
export class EventSubChannelSubscribersModerationEvent extends EventSubChannelBaseModerationEvent {
	override readonly moderationAction = 'subscribers' as const;
}
