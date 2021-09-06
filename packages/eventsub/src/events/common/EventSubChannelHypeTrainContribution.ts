export type EventSubChannelHypeTrainContributionType = 'bits' | 'subscription';

/** @private */
export interface EventSubChannelHypeTrainContribution {
	user_id: string;
	user_login: string;
	user_name: string;
	type: EventSubChannelHypeTrainContributionType;
	total: number;
}
