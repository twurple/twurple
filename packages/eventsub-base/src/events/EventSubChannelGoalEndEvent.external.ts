import { type EventSubChannelGoalType } from './common/EventSubChannelGoalType';

/** @private */
export interface EventSubChannelGoalEndEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: EventSubChannelGoalType;
	description: string;
	is_achieved: boolean;
	current_amount: number;
	target_amount: number;
	started_at: Date;
	ended_at: Date;
}
