import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';

/** @private */
export type EventSubChannelPredictionColor = 'blue' | 'pink';

/** @private */
export interface EventSubChannelPredictionBeginOutcomeData {
	id: string;
	title: string;
	color: EventSubChannelPredictionColor;
}

/**
 * A possible outcome of a prediction, as defined when beginning that prediction.
 */
@rtfm<EventSubChannelPredictionBeginOutcome>('twitch-eventsub', 'EventSubChannelPredictionBeginOutcome', 'id')
export class EventSubChannelPredictionBeginOutcome {
	/** @private */
	@Enumerable(false) protected readonly _data: EventSubChannelPredictionBeginOutcomeData;

	/** @private */
	constructor(data: EventSubChannelPredictionBeginOutcomeData) {
		this._data = data;
	}

	/**
	 * The ID of the outcome.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The title of the outcome.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The color of the outcome.
	 */
	get color(): EventSubChannelPredictionColor {
		return this._data.color;
	}
}
