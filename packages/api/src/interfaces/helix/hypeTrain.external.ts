/**
 * The type of a Hype Train contribution.
 */
export type HelixHypeTrainContributionType = 'BITS' | 'SUBS' | 'OTHER';

/** @private */
export interface HelixHypeTrainContributionData {
	total: number;
	user: string;
	type: HelixHypeTrainContributionType;
}

/** @private */
export interface HelixHypeTrainEventData {
	id: string;
	broadcaster_id: string;
	cooldown_end_time: string;
	expires_at: string;
	goal: number;
	last_contribution: HelixHypeTrainContributionData;
	level: number;
	started_at: string;
	top_contributions: HelixHypeTrainContributionData[];
	total: number;
}

/**
 * The different types a Hype Train event can have.
 */
export type HelixHypeTrainEventType = 'hypetrain.progression';
