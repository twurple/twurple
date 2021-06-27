import { rtfm } from '@twurple/common';
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
	/** @private */ protected declare readonly _data: EventSubChannelPollChoiceData;

	/**
	 * The number of votes for the choice added by using bits.
	 */
	get bitsVotes(): number {
		return this._data.bits_votes;
	}

	/**
	 * The number of votes for the choice added by using channel points.
	 */
	get channelPointsVotes(): number {
		return this._data.channel_points_votes;
	}

	/**
	 * The total number of votes for the choice, including bits and channel points.
	 */
	get totalVotes(): number {
		return this._data.votes;
	}
}
