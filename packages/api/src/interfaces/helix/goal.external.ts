export type HelixGoalType = 'follower' | 'subscription' | 'subscription_count' | 'new_subscription_count';

/** @private */
export interface HelixGoalData {
	id: string;
	broadcaster_id: string;
	broadcaster_name: string;
	broadcaster_login: string;
	type: HelixGoalType;
	description: string;
	current_amount: number;
	target_amount: number;
	created_at: Date;
}
