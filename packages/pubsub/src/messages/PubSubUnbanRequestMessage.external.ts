/**
 * The type of the unban request action.
 */
export type PubSubUnbanRequestType = 'APPROVE_UNBAN_REQUEST' | 'DENY_UNBAN_REQUEST';

/** @private */
export interface PubSubUnbanRequestMessageContent {
	moderation_action: PubSubUnbanRequestType;
	created_by_id: string;
	created_by_login: string;
	moderator_message: string;
	target_user_id: string;
	target_user_login: string;
}

/** @private */
export interface PubSubApproveUnbanRequestMessageData {
	type: 'approve_unban_request';
	data: PubSubUnbanRequestMessageContent;
}

/** @private */
export interface PubSubDenyUnbanRequestMessageData {
	type: 'deny_unban_request';
	data: PubSubUnbanRequestMessageContent;
}

/** @private */
export type PubSubUnbanRequestMessageData = PubSubApproveUnbanRequestMessageData | PubSubDenyUnbanRequestMessageData;
