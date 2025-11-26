import { type EventSubChannelPredictionBeginOutcomeData } from './common/EventSubChannelPredictionBeginOutcome.external.js';

/** @private */
export interface EventSubChannelPredictionBeginEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	title: string;
	outcomes: EventSubChannelPredictionBeginOutcomeData[];
	started_at: string;
	locks_at: string;
}
