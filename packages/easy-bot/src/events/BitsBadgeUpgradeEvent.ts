import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatBitsBadgeUpgradeInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<BitsBadgeUpgradeEvent>('easy-bot', 'BitsBadgeUpgradeEvent', 'userId')
export class BitsBadgeUpgradeEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _userName: string;
	@Enumerable(false) private readonly _info: ChatBitsBadgeUpgradeInfo;
	@Enumerable(false) private readonly _msg: UserNotice;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, userName: string, info: ChatBitsBadgeUpgradeInfo, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
		this._info = info;
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
		return this._info.displayName;
	}

	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	get threshold(): number {
		return this._info.threshold;
	}

	get messageObject(): UserNotice {
		return this._msg;
	}
}
