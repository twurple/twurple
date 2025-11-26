import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { HelixSentChatMessageData } from '../../interfaces/endpoints/chat.external.js';

/**
 * Information about a sent Twitch chat message.
 */
@rtfm<HelixSentChatMessage>('api', 'HelixSentChatMessage', 'id')
export class HelixSentChatMessage extends DataObject<HelixSentChatMessageData> {
	/**
	 * The message ID of the sent message.
	 */
	get id(): string {
		return this[rawDataSymbol].message_id;
	}

	/**
	 * If the message passed all checks and was sent.
	 */
	get isSent(): boolean {
		return this[rawDataSymbol].is_sent;
	}

	/**
	 * The reason code for why the chat message was dropped, if dropped.
	 */
	get dropReasonCode(): string | undefined {
		return this[rawDataSymbol].drop_reason?.code;
	}

	/**
	 * The reason message for why the chat message was dropped, if dropped.
	 */
	get dropReasonMessage(): string | undefined {
		return this[rawDataSymbol].drop_reason?.message;
	}
}
