import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatMessage, toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing a user sending a message to a channel's chat.
 *
 * @meta category events
 */
@rtfm<MessageEvent>('easy-bot', 'MessageEvent', 'userId')
export class MessageEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _userName: string;
	/** @internal */ @Enumerable(false) private readonly _text: string;
	/** @internal */ @Enumerable(false) private readonly _isAction: boolean;
	/** @internal */ @Enumerable(false) private readonly _msg: ChatMessage;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, userName: string, text: string, isAction: boolean, msg: ChatMessage, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
		this._text = text;
		this._isAction = isAction;
		this._msg = msg;
		this._bot = bot;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._msg.channelId!;
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
	 * The ID of the user who sent the message.
	 */
	get userId(): string {
		return this._msg.userInfo.userId;
	}

	/**
	 * The name of the user who sent the message.
	 */
	get userName(): string {
		return this._userName;
	}

	/**
	 * The display name of the user who sent the message.
	 */
	get userDisplayName(): string {
		return this._msg.userInfo.displayName;
	}

	/**
	 * Gets more information about the user who sent the message.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	/**
	 * The text that was sent.
	 */
	get text(): string {
		return this._text;
	}

	/**
	 * Whether the message is formatted as an action (sent using the /me chat command).
	 */
	get isAction(): boolean {
		return this._isAction;
	}

	/**
	 * The offsets of the emotes contained in the message.
	 */
	get emoteOffsets(): Map<string, string[]> {
		return this._msg.emoteOffsets;
	}

	/**
	 * The number of bits that have been cheered in the message.
	 */
	get bits(): number {
		return this._msg.bits;
	}

	/**
	 * Replies to the message.
	 *
	 * @param text The text to send as a reply.
	 */
	async reply(text: string): Promise<void> {
		await this._bot.reply(this.broadcasterName, text, this._msg);
	}

	/**
	 * Deletes the message.
	 */
	async delete(): Promise<void> {
		await this._bot.deleteMessageById(this.broadcasterId, this._msg);
	}
}
