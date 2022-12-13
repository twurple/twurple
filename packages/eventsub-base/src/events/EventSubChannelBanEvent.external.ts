/** @private */
export interface EventSubChannelBanEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	reason: string;
	banned_at: string;
	ends_at: string | null;
	is_permanent: boolean;
}
