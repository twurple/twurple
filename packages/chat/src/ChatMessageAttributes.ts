import { ChatMessage } from './commands/ChatMessage';

/**
 * Additional attributes for a channel message.
 */
export interface ChatSayMessageAttributes {
	/**
	 * The message to reply to.
	 */
	replyTo?: string | ChatMessage;
}

/** @private */
export function extractMessageId(message: string | ChatMessage): string {
	return message instanceof ChatMessage ? message.tags.get('id')! : message;
}
