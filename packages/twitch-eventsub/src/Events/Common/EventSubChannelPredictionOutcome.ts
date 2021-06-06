import type { EventSubChannelPredictionBeginOutcomeData } from './EventSubChannelPredictionBeginOutcome';
import type { EventSubChannelPredictionPredictorData } from './EventSubChannelPredictionPredictor';

/** @private */
export interface EventSubChannelPredictionOutcomeData extends EventSubChannelPredictionBeginOutcomeData {
	users: number;
	channel_points: number;
	top_predictors: EventSubChannelPredictionPredictorData[];
}
