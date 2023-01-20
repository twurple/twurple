/** @private */
export interface EventSubChannelShoutoutCreateEventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	to_broadcaster_user_id: string;
	to_broadcaster_user_login: string;
	to_broadcaster_user_name: string;
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	viewer_count: number;
	started_at: string;
	cooldown_ends_at: string;
	target_cooldown_ends_at: string;
}
