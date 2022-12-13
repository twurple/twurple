/** @private */
export interface PubSubChatModActionMessageContent {
	type: string;
	moderation_action: string;
	args: string[];
	created_by: string;
	created_by_user_id: string;
}

/** @private */
export interface PubSubChatModActionMessageData {
	data: PubSubChatModActionMessageContent;
}
