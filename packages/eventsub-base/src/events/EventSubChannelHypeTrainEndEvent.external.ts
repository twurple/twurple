import { type EventSubChannelHypeTrainContributionData } from './common/EventSubChannelHypeTrainContribution.external.js';

/** @private */
export interface EventSubChannelHypeTrainEndEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	level: number;
	total: number;
	top_contributions: EventSubChannelHypeTrainContributionData[] | null;
	started_at: string;
	ended_at: string;
	cooldown_ends_at: string;
	is_golden_kappa_train: boolean;
}
