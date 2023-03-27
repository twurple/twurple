import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type Whisper } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<WhisperEvent>('easy-bot', 'WhisperEvent', 'userId')
export class WhisperEvent {
	@Enumerable(false) private readonly _userName: string;
	@Enumerable(false) private readonly _message: string;
	@Enumerable(false) private readonly _msg: Whisper;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(userName: string, message: string, msg: Whisper, bot: Bot) {
		this._userName = userName;
		this._message = message;
		this._msg = msg;
		this._bot = bot;
	}

	get userId(): string {
		return this._msg.userInfo.userId;
	}

	get userName(): string {
		return this._userName;
	}

	get userDisplayName(): string {
		return this._msg.userInfo.displayName;
	}

	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	get message(): string {
		return this._message;
	}

	async reply(text: string): Promise<void> {
		await this._bot.whisperById(this.userId, text);
	}
}
