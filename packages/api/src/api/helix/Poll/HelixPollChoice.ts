import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

/** @private */
export interface HelixPollChoiceData {
	id: string;
	title: string;
	votes: number;
	channel_points_votes: number;
	bits_votes: number;
}

/**
 * A choice in a channel poll.
 */
@rtfm<HelixPollChoice>('twitch', 'HelixPollChoice', 'id')
export class HelixPollChoice {
	@Enumerable(false) private readonly _data: HelixPollChoiceData;

	/** @private */
	constructor(data: HelixPollChoiceData) {
		this._data = data;
	}

	/**
	 * The ID of the choice.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The title of the choice.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The total votes the choice received.
	 */
	get totalVotes(): number {
		return this._data.votes;
	}

	/**
	 * The votes the choice received by spending channel points.
	 */
	get channelPointsVotes(): number {
		return this._data.channel_points_votes;
	}

	/**
	 * The votes the choice received by spending bits.
	 */
	get bitsVotes(): number {
		return this._data.bits_votes;
	}
}
