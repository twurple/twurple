/** @private */
export interface HypeTrainContribution {
	user_id: string;
	user_name: string;
	type: 'bits' | 'subscription';
	total: number;
}
