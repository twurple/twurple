import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<RaidCancelEvent>('easy-bot', 'RaidCancelEvent', 'broadcasterName')
export class RaidCancelEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _msg: UserNotice;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
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
		return this._msg.userInfo.userName;
	}

	get userDisplayName(): string {
		return this._msg.userInfo.displayName;
	}

	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	get messageObject(): UserNotice {
		return this._msg;
	}
}
