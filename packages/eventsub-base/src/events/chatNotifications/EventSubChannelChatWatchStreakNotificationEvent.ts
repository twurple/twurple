import { rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelChatBaseNotificationEvent } from './EventSubChannelChatBaseNotificationEvent.js';
import { type EventSubChannelChatWatchStreakNotificationEventData } from './EventSubChannelChatNotificationEvent.external.js';

/**
 * An EventSub event representing a Watch Streak notification in a channel's chat.
 */
@rtfm<EventSubChannelChatWatchStreakNotificationEvent>(
	'eventsub-base',
	'EventSubChannelChatWatchStreakNotificationEvent',
	'broadcasterId',
)
export class EventSubChannelChatWatchStreakNotificationEvent extends EventSubChannelChatBaseNotificationEvent {
	/** @internal */ declare readonly [rawDataSymbol]: EventSubChannelChatWatchStreakNotificationEventData;

	readonly type = 'watch_streak' as const;

	/**
	 * The number of consecutive broadcasts for which the user has been watching.
	 */
	get streakCount(): number {
		return this[rawDataSymbol].watch_streak.streak_count;
	}

	/**
	 * The number of channel points awarded for the Watch Streak milestone.
	 */
	get channelPointsAwarded(): number {
		return this[rawDataSymbol].watch_streak.channel_points_awarded;
	}
}
