import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatCommunityPayForwardInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot.js';

/**
 * An event representing a user gifting a subscription to the community of a channel in response to getting one gifted.
 *
 * @meta category events
 */
@rtfm<CommunityPayForwardEvent>('easy-bot', 'CommunityPayForwardEvent', 'gifterId')
export class CommunityPayForwardEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _gifterName: string;
	/** @internal */ @Enumerable(false) private readonly _info: ChatCommunityPayForwardInfo;
	/** @internal */ @Enumerable(false) private readonly _msg: UserNotice;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, userName: string, info: ChatCommunityPayForwardInfo, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._gifterName = userName;
		this._info = info;
		this._msg = msg;
		this._bot = bot;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._msg.channelId!;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._broadcasterName;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
	}

	/**
	 * The ID of the user who sent the new gift.
	 */
	get gifterId(): string {
		return this._msg.userInfo.userId;
	}

	/**
	 * The name of the user who sent the new gift.
	 */
	get gifterName(): string {
		return this._gifterName;
	}

	/**
	 * The display name of the user who sent the new gift.
	 */
	get gifterDisplayName(): string {
		return this._info.displayName;
	}

	/**
	 * Gets more information about the user who sent the new gift.
	 */
	async getGifter(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.gifterId));
	}

	/**
	 * The ID of the user who sent the original gift, or `null` if they were anonymous.
	 */
	get originalGifterId(): string | null {
		return this._info.originalGifterUserId ?? null;
	}

	/**
	 * The display name of the user who sent the original gift, or `null` if they were anonymous.
	 */
	get originalGifterDisplayName(): string | null {
		return this._info.originalGifterDisplayName ?? null;
	}

	/**
	 * Gets more information about the user who sent the original gift, or `null` if they were anonymous.
	 */
	async getOriginalGifter(): Promise<HelixUser | null> {
		const id = this.originalGifterId;
		if (!id) {
			return null;
		}

		return checkRelationAssertion(await this._bot.api.users.getUserById(id));
	}
}
