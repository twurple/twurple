import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubChannelPredictionBeginOutcomeData,
	type EventSubChannelPredictionColor
} from './EventSubChannelPredictionBeginOutcome.external';

/**
 * A possible outcome of a prediction, as defined when beginning that prediction.
 */
@rtfm<EventSubChannelPredictionBeginOutcome>('eventsub-base', 'EventSubChannelPredictionBeginOutcome', 'id')
export class EventSubChannelPredictionBeginOutcome extends DataObject<EventSubChannelPredictionBeginOutcomeData> {
	/**
	 * The ID of the outcome.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The title of the outcome.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The color of the outcome.
	 */
	get color(): EventSubChannelPredictionColor {
		return this[rawDataSymbol].color;
	}
}
