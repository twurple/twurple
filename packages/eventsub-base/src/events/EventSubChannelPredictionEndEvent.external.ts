import { type EventSubChannelPredictionOutcomeData } from './common/EventSubChannelPredictionOutcome.external.js';

/**
 * The status of the prediction.
 */
export type EventSubChannelPredictionEndStatus = 'resolved' | 'canceled';

/** @private */
export interface EventSubChannelPredictionEndEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	title: string;
	winning_outcome_id: string | null;
	outcomes: EventSubChannelPredictionOutcomeData[];
	status: EventSubChannelPredictionEndStatus;
	started_at: string;
	ended_at: string;
}
