import { rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelPollBeginChoiceData } from './EventSubChannelPollBeginChoice';
import { EventSubChannelPollBeginChoice } from './EventSubChannelPollBeginChoice';

/** @private */
export interface EventSubChannelPollChoiceData extends EventSubChannelPollBeginChoiceData {
	bits_votes: number;
	channel_points_votes: number;
	votes: number;
}

/**
 * A choice in a poll.
 *
 * @inheritDoc
 */
@rtfm<EventSubChannelPollChoice>('eventsub', 'EventSubChannelPollChoice', 'id')
export class EventSubChannelPollChoice extends EventSubChannelPollBeginChoice {
	/** @private */ declare readonly [rawDataSymbol]: EventSubChannelPollChoiceData;

	/**
	 * The number of votes for the choice added by using bits.
	 *
	 * @deprecated Twitch removed this feature.
	 */
	get bitsVotes(): number {
		return this[rawDataSymbol].bits_votes;
	}

	/**
	 * The number of votes for the choice added by using channel points.
	 */
	get channelPointsVotes(): number {
		return this[rawDataSymbol].channel_points_votes;
	}

	/**
	 * The total number of votes for the choice, including bits and channel points.
	 */
	get totalVotes(): number {
		return this[rawDataSymbol].votes;
	}
}
