/** @private */
export interface EventSubChannelChatSettingsUpdateEventData {
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	emote_mode: boolean;
	follower_mode: boolean;
	follower_mode_duration_minutes: number | null;
	slow_mode: boolean;
	slow_mode_wait_time_seconds: number | null;
	subscriber_mode: boolean;
	unique_chat_mode: boolean;
}
