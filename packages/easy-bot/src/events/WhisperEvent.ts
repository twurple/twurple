import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type Whisper } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing a whisper message.
 *
 * @meta category events
 */
@rtfm<WhisperEvent>('easy-bot', 'WhisperEvent', 'userId')
export class WhisperEvent {
	/** @internal */ @Enumerable(false) private readonly _userName: string;
	/** @internal */ @Enumerable(false) private readonly _text: string;
	/** @internal */ @Enumerable(false) private readonly _msg: Whisper;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(userName: string, text: string, msg: Whisper, bot: Bot) {
		this._userName = userName;
		this._text = text;
		this._msg = msg;
		this._bot = bot;
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
	 * The text of the message.
	 */
	get text(): string {
		return this._text;
	}

	/**
	 * Replies to the message.
	 *
	 * @param text The text to send as a reply.
	 */
	async reply(text: string): Promise<void> {
		await this._bot.whisperById(this.userId, text);
	}
}
