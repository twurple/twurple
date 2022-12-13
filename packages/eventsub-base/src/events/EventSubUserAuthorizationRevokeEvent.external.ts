/** @private */
export interface EventSubUserAuthorizationRevokeEventData {
	client_id: string;
	user_id: string;
	user_login: string | null;
	user_name: string | null;
}
