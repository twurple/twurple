import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelBaseModerationEvent } from './EventSubChannelBaseModerationEvent.js';
import { type EventSubChannelSlowModerationEventData } from './EventSubChannelModerationEvent.external.js';

/**
 * An EventSub event representing a moderator enabling slow mode on a channel.
 */
@rtfm<EventSubChannelSlowModerationEvent>('eventsub-base', 'EventSubChannelSlowModerationEvent', 'broadcasterId')
export class EventSubChannelSlowModerationEvent extends EventSubChannelBaseModerationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelSlowModerationEventData;

	override readonly moderationAction = 'slow' as const;

	/**
	 * The amount of time, in seconds, that users need to wait between sending messages.
	 */
	get waitTimeSeconds(): number {
		return this[rawDataSymbol].slow.wait_time_seconds;
	}
}
