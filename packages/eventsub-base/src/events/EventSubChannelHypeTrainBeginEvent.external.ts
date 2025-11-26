import { type EventSubChannelHypeTrainContributionData } from './common/EventSubChannelHypeTrainContribution.external.js';

/** @private */
export interface EventSubChannelHypeTrainBeginEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	level: number;
	total: number;
	progress: number;
	goal: number;
	top_contributions: EventSubChannelHypeTrainContributionData[] | null;
	last_contribution: EventSubChannelHypeTrainContributionData;
	started_at: string;
	expires_at: string;
	is_golden_kappa_train: boolean;
}
