import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatStandardPayForwardInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<StandardPayForwardEvent>('easy-bot', 'StandardPayForwardEvent', 'gifterId')
export class StandardPayForwardEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _gifterName: string;
	@Enumerable(false) private readonly _info: ChatStandardPayForwardInfo;
	@Enumerable(false) protected readonly _msg: UserNotice;
	@Enumerable(false) protected readonly _bot: Bot;

	constructor(channel: string, userName: string, info: ChatStandardPayForwardInfo, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._gifterName = userName;
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
		return this._info.recipientUserId;
	}

	get userDisplayName(): string {
		return this._info.recipientDisplayName;
	}

	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	get gifterId(): string {
		return this._msg.userInfo.userId;
	}

	get gifterName(): string {
		return this._gifterName;
	}

	get gifterDisplayName(): string {
		return this._info.displayName;
	}

	async getGifter(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.gifterId));
	}

	get originalGifterId(): string | null {
		return this._info.originalGifterUserId ?? null;
	}

	get originalGifterDisplayName(): string | null {
		return this._info.originalGifterDisplayName ?? null;
	}

	async getOriginalGifter(): Promise<HelixUser | null> {
		const id = this.originalGifterId;
		if (!id) {
			return null;
		}

		return checkRelationAssertion(await this._bot.api.users.getUserById(id));
	}

	get messageObject(): UserNotice {
		return this._msg;
	}
}
