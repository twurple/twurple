import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type PrivateMessage, toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<MessageEvent>('easy-bot', 'MessageEvent', 'userId')
export class MessageEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _userName: string;
	@Enumerable(false) private readonly _message: string;
	@Enumerable(false) private readonly _isAction: boolean;
	@Enumerable(false) private readonly _msg: PrivateMessage;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, userName: string, message: string, isAction: boolean, msg: PrivateMessage, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
		this._message = message;
		this._isAction = isAction;
		this._msg = msg;
		this._bot = bot;
	}

	get broadcasterId(): string {
		return this._msg.channelId!;
	}

	get broadcasterName(): string {
		return this._broadcasterName;
	}

	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
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

	get isAction(): boolean {
		return this._isAction;
	}

	get emoteOffsets(): Map<string, string[]> {
		return this._msg.emoteOffsets;
	}

	async reply(text: string): Promise<void> {
		await this._bot.reply(this.broadcasterName, text, this._msg);
	}

	async delete(): Promise<void> {
		await this._bot.deleteMessageById(this.broadcasterId, this._msg);
	}
}
