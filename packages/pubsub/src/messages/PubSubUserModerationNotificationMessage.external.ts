export type PubSubUserModerationNotificationMessageStatus = 'PENDING' | 'ALLOWED' | 'DENIED' | 'EXPIRED';

/** @private */
export interface PubSubUserModerationNotificationMessageContent {
	message_id: string;
	status: PubSubUserModerationNotificationMessageStatus;
}

/** @private */
export interface PubSubUserModerationNotificationMessageData {
	type: 'automod_caught_message';
	data: PubSubUserModerationNotificationMessageContent;
}
