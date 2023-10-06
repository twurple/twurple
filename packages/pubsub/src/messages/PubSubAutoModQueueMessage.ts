import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type PubSubAutoModQueueMessageContentClassification,
	type PubSubAutoModQueueMessageData,
	type PubSubAutoModQueueMessageFragment,
	type PubSubAutoModQueueStatus,
} from './PubSubAutoModQueueMessage.external';

/**
 * A message that informs about a message being processed in the AutoMod queue.
 */
@rtfm<PubSubAutoModQueueMessage>('pubsub', 'PubSubAutoModQueueMessage', 'messageId')
export class PubSubAutoModQueueMessage extends DataObject<PubSubAutoModQueueMessageData> {
	/** @internal */
	constructor(data: PubSubAutoModQueueMessageData, private readonly _channelId: string) {
		super(data);
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
		return this[rawDataSymbol].data.message.id;
	}

	/**
	 * The content of the message.
	 */
	get messageContent(): string {
		return this[rawDataSymbol].data.message.content.text;
	}

	/**
	 * The fragments of the message that were found to be against the moderation level of the channel.
	 */
	get foundMessageFragments(): PubSubAutoModQueueMessageFragment[] {
		return this[rawDataSymbol].data.message.content.fragments;
	}

	/**
	 * The ID of the user that sent the message.
	 */
	get senderId(): string {
		return this[rawDataSymbol].data.message.sender.user_id;
	}

	/**
	 * The name of the user that sent the message.
	 */
	get senderName(): string {
		return this[rawDataSymbol].data.message.sender.login;
	}

	/**
	 * The display name of the user that sent the message.
	 */
	get senderDisplayName(): string {
		return this[rawDataSymbol].data.message.sender.display_name;
	}

	/**
	 * The chat color of the user that sent the message.
	 */
	get senderColor(): string {
		return this[rawDataSymbol].data.message.sender.chat_color;
	}

	/**
	 * The date when the message was sent.
	 */
	get sendDate(): Date {
		return new Date(this[rawDataSymbol].data.message.sent_at);
	}

	/**
	 * The classification of the message content.
	 */
	get contentClassification(): PubSubAutoModQueueMessageContentClassification {
		return this[rawDataSymbol].data.content_classification;
	}

	/**
	 * The status of the queue entry.
	 */
	get status(): PubSubAutoModQueueStatus {
		return this[rawDataSymbol].data.status;
	}

	/**
	 * The ID of the user that resolved the queue entry, or null if it was not resolved or timed out.
	 */
	get resolverId(): string | null {
		return this[rawDataSymbol].data.resolver_id || null;
	}

	/**
	 * The name of the user that resolved the queue entry, or null if it was not resolved or timed out.
	 */
	get resolverName(): string | null {
		return this[rawDataSymbol].data.resolver_login || null;
	}
}
