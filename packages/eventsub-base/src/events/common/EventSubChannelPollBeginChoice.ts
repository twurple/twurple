import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface EventSubChannelPollBeginChoiceData {
	id: string;
	title: string;
}

/**
 * A choice in a poll, as defined when beginning that poll.
 */
@rtfm<EventSubChannelPollBeginChoice>('eventsub-base', 'EventSubChannelPollBeginChoice', 'id')
export class EventSubChannelPollBeginChoice extends DataObject<EventSubChannelPollBeginChoiceData> {
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
}
