/**
 * The status of the resolved unban request.
 */
export type EventSubChannelUnbanRequestStatus = 'approved' | 'denied' | 'canceled';

/** @private */
export interface EventSubChannelUnbanRequestResolveEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	moderator_user_id: string;
	moderator_user_login: string;
	moderator_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	resolution_text?: string;
	status: EventSubChannelUnbanRequestStatus;
}
