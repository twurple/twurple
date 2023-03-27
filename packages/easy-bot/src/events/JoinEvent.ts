import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<JoinEvent>('easy-bot', 'JoinEvent', 'broadcasterName')
export class JoinEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _userName: string;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, userName: string, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
		this._bot = bot;
	}

	get broadcasterName(): string {
		return this._broadcasterName;
	}

	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.broadcasterName));
	}

	get userName(): string {
		return this._userName;
	}

	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.userName));
	}

	leave(): void {
		this._bot.leave(this.broadcasterName);
	}
}
