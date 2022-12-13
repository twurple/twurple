import { type EventSubChannelPredictionOutcomeData } from './common/EventSubChannelPredictionOutcome.external';

/** @private */
export interface EventSubChannelPredictionLockEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	title: string;
	outcomes: EventSubChannelPredictionOutcomeData[];
	started_at: string;
	locked_at: string;
}
