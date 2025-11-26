import { type EventSubChannelPredictionBeginOutcomeData } from './EventSubChannelPredictionBeginOutcome.external.js';
import { type EventSubChannelPredictionPredictorData } from './EventSubChannelPredictionPredictor.external.js';

/** @private */
export interface EventSubChannelPredictionOutcomeData extends EventSubChannelPredictionBeginOutcomeData {
	users: number;
	channel_points: number;
	top_predictors: EventSubChannelPredictionPredictorData[];
}
