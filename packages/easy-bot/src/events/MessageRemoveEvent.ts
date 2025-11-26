import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ClearMsg, toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot.js';

/**
 * An event representing a message being removed from a channel's chat.
 *
 * @meta category events
 */
@rtfm<MessageRemoveEvent>('easy-bot', 'MessageRemoveEvent', 'broadcasterName')
export class MessageRemoveEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _messageId: string;
	/** @internal */ @Enumerable(false) private readonly _msg: ClearMsg;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, messageId: string, msg: ClearMsg, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._messageId = messageId;
		this._msg = msg;
		this._bot = bot;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._msg.channelId;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._broadcasterName;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
	}

	/**
	 * The name of the user who originally sent the message.
	 */
	get userName(): string {
		return this._msg.userName;
	}

	/**
	 * The ID of the deleted message.
	 */
	get messageId(): string {
		return this._messageId;
	}

	/**
	 * The text of the deleted message.
	 */
	get originalText(): string {
		return this._msg.text;
	}

	/**
	 * The full object that contains all the message information.
	 */
	get messageObject(): ClearMsg {
		return this._msg;
	}
}
