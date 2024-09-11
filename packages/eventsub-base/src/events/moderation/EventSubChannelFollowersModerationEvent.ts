import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent';
import { type EventSubChannelFollowersModerationEventData } from './EventSubChannelModerationEvent.external';

/**
 * An EventSub event representing a moderator enabling followers-only mode on a channel.
 */
@rtfm<EventSubChannelFollowersModerationEvent>(
	'eventsub-base',
	'EventSubChannelFollowersModerationEvent',
	'broadcasterId',
)
export class EventSubChannelFollowersModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelFollowersModerationEventData;

	override readonly moderationAction = 'followers';

	/**
	 * The length of time, in minutes, that the followers must have followed the broadcaster to participate in
	 * the chat room.
	 */
	get followDurationMinutes(): number {
		return this[rawDataSymbol].followers.follow_duration_minutes;
	}
}
