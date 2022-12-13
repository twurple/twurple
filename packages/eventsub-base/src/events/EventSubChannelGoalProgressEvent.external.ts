import { type EventSubChannelGoalType } from './common/EventSubChannelGoalType';

/** @private */
export interface EventSubChannelGoalProgressEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: EventSubChannelGoalType;
	description: string;
	current_amount: number;
	target_amount: number;
	started_at: Date;
}
