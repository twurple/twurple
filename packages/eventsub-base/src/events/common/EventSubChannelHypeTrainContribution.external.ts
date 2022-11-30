/**
 * The type of hype train contribution. Can be "bits" or "subscription".
 */
export type EventSubChannelHypeTrainContributionType = 'bits' | 'subscription';

/** @private */
export interface EventSubChannelHypeTrainContributionData {
	user_id: string;
	user_login: string;
	user_name: string;
	type: EventSubChannelHypeTrainContributionType;
	total: number;
}
