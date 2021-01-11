/** @private */
export interface EventSubChannelHypeTrainContribution {
	user_id: string;
	user_name: string;
	type: 'bits' | 'subscription';
	total: number;
}
