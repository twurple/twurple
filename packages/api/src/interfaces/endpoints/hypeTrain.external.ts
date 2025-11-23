/**
 * The type of a Hype Train contribution.
 */
export type HelixHypeTrainContributionType = 'bits' | 'subscription' | 'other';

/** @private */
export interface HelixHypeTrainContributionData {
	user_id: string;
	user_login: string;
	user_name: string;
	type: HelixHypeTrainContributionType;
	total: number;
}

/** @private */
export interface HelixHypeTrainSharedParticipantData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
}

/**
 * The type of a Hype Train.
 */
export type HelixHypeTrainType = 'regular' | 'golden_kappa' | 'treasure';

/** @private */
export interface HelixHypeTrainData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	level: number;
	total: number;
	progress: number;
	goal: number;
	top_contributions: HelixHypeTrainContributionData[];
	shared_train_participants: HelixHypeTrainSharedParticipantData[];
	started_at: string;
	expires_at: string;
	type: HelixHypeTrainType;
	is_shared_train: boolean;
}

/** @private */
export interface HelixHypeTrainAllTimeHighData {
	level: number;
	total: number;
	achieved_at: string;
}

/** @private */
export interface HelixHypeTrainStatusData {
	current: HelixHypeTrainData | null;
	all_time_high: HelixHypeTrainAllTimeHighData | null;
	shared_all_time_high: HelixHypeTrainAllTimeHighData | null;
}
