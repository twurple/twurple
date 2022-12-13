/** @private */
export interface EventSubUserUpdateEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	email?: string;
	email_verified: boolean;
	description: string;
}
