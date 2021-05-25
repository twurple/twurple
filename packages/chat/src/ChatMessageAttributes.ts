import { TwitchPrivateMessage } from './commands/TwitchPrivateMessage';

/**
 * Additional attributes for a channel message.
 */
export interface ChatSayMessageAttributes {
	/**
	 * The message to reply to.
	 */
	replyTo?: string | TwitchPrivateMessage;
}

/** @private */
export function extractMessageId(message: string | TwitchPrivateMessage): string {
	return message instanceof TwitchPrivateMessage ? message.tags.get('id')! : message;
}
