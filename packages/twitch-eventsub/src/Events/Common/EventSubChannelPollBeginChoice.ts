import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

/** @private */
export interface EventSubChannelPollBeginChoiceData {
	id: string;
	title: string;
}

/**
 * A choice in a poll, as defined when beginning that poll.
 */
@rtfm<EventSubChannelPollBeginChoice>('twitch-eventsub', 'EventSubChannelPollBeginChoice', 'id')
export class EventSubChannelPollBeginChoice {
	/** @private */
	@Enumerable(false) protected readonly _data: EventSubChannelPollBeginChoiceData;

	/** @private */
	constructor(data: EventSubChannelPollBeginChoiceData) {
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
}
