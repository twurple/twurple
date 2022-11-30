/**
 * The color of a prediction outcome, blue or pink.
 */
export type EventSubChannelPredictionColor = 'blue' | 'pink';

/** @private */
export interface EventSubChannelPredictionBeginOutcomeData {
	id: string;
	title: string;
	color: EventSubChannelPredictionColor;
}
