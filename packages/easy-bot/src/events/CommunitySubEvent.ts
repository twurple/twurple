import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatCommunitySubInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<CommunitySubEvent>('easy-bot', 'CommunitySubEvent', 'gifterId')
export class CommunitySubEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _info: ChatCommunitySubInfo;
	@Enumerable(false) protected readonly _msg: UserNotice;
	@Enumerable(false) protected readonly _bot: Bot;

	constructor(channel: string, info: ChatCommunitySubInfo, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
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

	get gifterId(): string | null {
		return this._info.gifterUserId ?? null;
	}

	get gifterName(): string | null {
		return this._info.gifter ?? null;
	}

	get gifterDisplayName(): string | null {
		return this._info.gifterDisplayName ?? null;
	}

	async getGifter(): Promise<HelixUser | null> {
		const id = this.gifterId;
		if (!id) {
			return null;
		}

		return checkRelationAssertion(await this._bot.api.users.getUserById(id));
	}

	get plan(): string {
		return this._info.plan;
	}

	get messageObject(): UserNotice {
		return this._msg;
	}
}
