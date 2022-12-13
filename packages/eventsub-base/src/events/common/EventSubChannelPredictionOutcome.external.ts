import { type EventSubChannelPredictionBeginOutcomeData } from './EventSubChannelPredictionBeginOutcome.external';
import { type EventSubChannelPredictionPredictorData } from './EventSubChannelPredictionPredictor.external';

/** @private */
export interface EventSubChannelPredictionOutcomeData extends EventSubChannelPredictionBeginOutcomeData {
	users: number;
	channel_points: number;
	top_predictors: EventSubChannelPredictionPredictorData[];
}
