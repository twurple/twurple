/** @private */
export interface PubSubAutoModQueueMessageAutoModInternals {
	topics: Record<string, number>;
}

/** @private */
export interface PubSubAutoModQueueMessageFragment {
	text: string;
	automod: PubSubAutoModQueueMessageAutoModInternals;
}

/** @private */
export interface PubSubAutoModQueueMessageDetailContent {
	text: string;
	fragments: PubSubAutoModQueueMessageFragment[];
}

/** @private */
export interface PubSubAutoModQueueMessageSenderData {
	user_id: string;
	login: string;
	display_name: string;
	chat_color: string;
}

/** @private */
export interface PubSubAutoModQueueMessageDetail {
	id: string;
	content: PubSubAutoModQueueMessageDetailContent;
	sender: PubSubAutoModQueueMessageSenderData;
	sent_at: string;
}

/** @private */
export interface PubSubAutoModQueueMessageContentClassification {
	category: string;
	level: number;
}

export type PubSubAutoModQueueStatus = 'PENDING' | 'ALLOWED' | 'DENIED' | 'EXPIRED';

/** @private */
export interface PubSubAutoModQueueMessageContent {
	message: PubSubAutoModQueueMessageDetail;
	content_classification: PubSubAutoModQueueMessageContentClassification;
	status: PubSubAutoModQueueStatus;
	reason_code: string;
	resolver_id: string;
	resolver_login: string;
}

/** @private */
export interface PubSubAutoModQueueMessageData {
	type: 'automod_caught_message';
	data: PubSubAutoModQueueMessageContent;
}
