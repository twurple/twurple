import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';

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

/**
 * A message that informs about a message being processed in the AutoMod queue.
 */
@rtfm<PubSubAutoModQueueMessage>('pubsub', 'PubSubAutoModQueueMessage', 'messageId')
export class PubSubAutoModQueueMessage {
	@Enumerable(false) private readonly _data: PubSubAutoModQueueMessageData;

	/** @private */
	constructor(data: PubSubAutoModQueueMessageData, private readonly _channelId: string) {
		this._data = data;
	}

	/**
	 * The ID of the channel where the message was posted.
	 */
	get channelId(): string {
		return this._channelId;
	}

	/**
	 * The ID of the message.
	 */
	get messageId(): string {
		return this._data.data.message.id;
	}

	/**
	 * The content of the message.
	 */
	get messageContent(): string {
		return this._data.data.message.content.text;
	}

	/**
	 * The fragments of the message that were found to be against the moderation level of the channel.
	 */
	get foundMessageFragments(): PubSubAutoModQueueMessageFragment[] {
		return this._data.data.message.content.fragments;
	}

	/**
	 * The ID of the user that sent the message.
	 */
	get senderId(): string {
		return this._data.data.message.sender.user_id;
	}

	/**
	 * The name of the user that sent the message.
	 */
	get senderName(): string {
		return this._data.data.message.sender.login;
	}

	/**
	 * The display name of the user that sent the message.
	 */
	get senderDisplayName(): string {
		return this._data.data.message.sender.display_name;
	}

	/**
	 * The chat color of the user that sent the message.
	 */
	get senderColor(): string {
		return this._data.data.message.sender.chat_color;
	}

	/**
	 * The date when the message was sent.
	 */
	get sendDate(): Date {
		return new Date(this._data.data.message.sent_at);
	}

	/**
	 * The classification of the message content.
	 */
	get contentClassification(): PubSubAutoModQueueMessageContentClassification {
		return this._data.data.content_classification;
	}

	/**
	 * The status of the queue entry.
	 */
	get status(): PubSubAutoModQueueStatus {
		return this._data.data.status;
	}

	/**
	 * The ID of the user that resolved the queue entry, or null if it was not resolved or timed out.
	 */
	get resolverId(): string | null {
		return this._data.data.resolver_id || null;
	}

	/**
	 * The name of the user that resolved the queue entry, or null if it was not resolved or timed out.
	 */
	get resolverName(): string | null {
		return this._data.data.resolver_login || null;
	}
}
