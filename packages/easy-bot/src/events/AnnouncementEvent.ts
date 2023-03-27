import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatAnnouncementInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<AnnouncementEvent>('easy-bot', 'AnnouncementEvent', 'broadcasterId')
export class AnnouncementEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _userName: string;
	@Enumerable(false) private readonly _info: ChatAnnouncementInfo;
	@Enumerable(false) protected readonly _msg: UserNotice;
	@Enumerable(false) protected readonly _bot: Bot;

	constructor(channel: string, userName: string, info: ChatAnnouncementInfo, msg: UserNotice, bot: Bot) {
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
		return this._msg.userInfo.displayName;
	}

	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	get color(): string {
		return this._info.color;
	}
}
