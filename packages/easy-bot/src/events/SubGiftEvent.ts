import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatSubGiftInfo, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot.js';
import { SubEvent } from './SubEvent.js';

/**
 * An event representing a user gifting a subscription to another user.
 *
 * @meta category events
 */
@rtfm<SubGiftEvent>('easy-bot', 'SubGiftEvent', 'userId')
export class SubGiftEvent extends SubEvent {
	/** @internal */ @Enumerable(false) private readonly _giftInfo: ChatSubGiftInfo;

	/** @internal */
	constructor(channel: string, userName: string, info: ChatSubGiftInfo, msg: UserNotice, bot: Bot) {
		super(channel, userName, info, msg, bot);
		this._giftInfo = info;
	}

	/**
	 * The ID of the user who sent the gift.
	 */
	get gifterId(): string | null {
		return this._giftInfo.gifterUserId ?? null;
	}

	/**
	 * The name of the user who sent the gift.
	 */
	get gifterName(): string | null {
		return this._giftInfo.gifter ?? null;
	}

	/**
	 * The display name of the user who sent the gift.
	 */
	get gifterDisplayName(): string | null {
		return this._giftInfo.gifterDisplayName ?? null;
	}

	/**
	 * Gets more information about the user who sent the gift.
	 */
	async getGifter(): Promise<HelixUser | null> {
		const id = this.gifterId;
		if (!id) {
			return null;
		}

		return checkRelationAssertion(await this._bot.api.users.getUserById(id));
	}
}
