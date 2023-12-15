/** @private */
export interface EventSubChannelAdBreakBeginEventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	requester_user_id: string;
	requester_user_login: string;
	requester_user_name: string;
	started_at: string;
	duration_seconds: number;
	is_automatic: boolean;
}
