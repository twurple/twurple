/**
 * The type of role change.
 */
export type PubSubChannelRoleChangeType = 'moderator_added' | 'moderator_removed' | 'vip_added' | 'vip_removed';

/** @private */
export interface PubSubChannelRoleChangeMessageContent {
	channel_id: string;
	target_user_id: string;
	target_user_login: string;
	created_by_user_id: string;
	created_by: string;
}

/** @private */
export interface PubSubChannelRoleChangeMessageData {
	type: PubSubChannelRoleChangeType;
	data: PubSubChannelRoleChangeMessageContent;
}
