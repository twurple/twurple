import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatSubGiftInfo, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';
import { SubEvent } from './SubEvent';

@rtfm<SubGiftEvent>('easy-bot', 'SubGiftEvent', 'userId')
export class SubGiftEvent extends SubEvent {
	@Enumerable(false) private readonly _giftInfo: ChatSubGiftInfo;

	constructor(channel: string, userName: string, info: ChatSubGiftInfo, msg: UserNotice, bot: Bot) {
		super(channel, userName, info, msg, bot);
		this._giftInfo = info;
	}

	get gifterId(): string | null {
		return this._giftInfo.gifterUserId ?? null;
	}

	get gifterName(): string | null {
		return this._giftInfo.gifter ?? null;
	}

	get gifterDisplayName(): string | null {
		return this._giftInfo.gifterDisplayName ?? null;
	}

	async getGifter(): Promise<HelixUser | null> {
		const id = this.gifterId;
		if (!id) {
			return null;
		}

		return checkRelationAssertion(await this._bot.api.users.getUserById(id));
	}
}
