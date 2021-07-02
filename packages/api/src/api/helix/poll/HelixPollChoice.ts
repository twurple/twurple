import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

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
@rtfm<HelixPollChoice>('api', 'HelixPollChoice', 'id')
export class HelixPollChoice extends DataObject<HelixPollChoiceData> {
	/**
	 * The ID of the choice.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The title of the choice.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The total votes the choice received.
	 */
	get totalVotes(): number {
		return this[rawDataSymbol].votes;
	}

	/**
	 * The votes the choice received by spending channel points.
	 */
	get channelPointsVotes(): number {
		return this[rawDataSymbol].channel_points_votes;
	}

	/**
	 * The votes the choice received by spending bits.
	 */
	get bitsVotes(): number {
		return this[rawDataSymbol].bits_votes;
	}
}
