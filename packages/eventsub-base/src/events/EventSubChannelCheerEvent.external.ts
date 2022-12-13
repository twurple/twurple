/** @private */
export interface EventSubChannelCheerEventData {
	is_anonymous: boolean;
	user_id: string | null;
	user_login: string | null;
	user_name: string | null;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	message: string;
	bits: number;
}
