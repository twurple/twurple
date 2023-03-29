import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatSubGiftUpgradeInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing a gifted subscription being replaced by a paid one.
 *
 * @meta category events
 */
@rtfm<GiftPaidUpgradeEvent>('easy-bot', 'GiftPaidUpgradeEvent', 'userId')
export class GiftPaidUpgradeEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _userName: string;
	/** @internal */ @Enumerable(false) private readonly _info: ChatSubGiftUpgradeInfo;
	/** @internal */ @Enumerable(false) private readonly _msg: UserNotice;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, userName: string, info: ChatSubGiftUpgradeInfo, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
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
	 * Gets more info about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
	}

	/**
	 * The ID of the user who paid for their subscription.
	 */
	get userId(): string {
		return this._info.userId;
	}

	/**
	 * The name of the user who paid for their subscription.
	 */
	get userName(): string {
		return this._userName;
	}

	/**
	 * The display name of the user who paid for their subscription.
	 */
	get userDisplayName(): string {
		return this._info.displayName;
	}

	/**
	 * Gets more information about the user who paid for their subscription.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	// TODO: might have anon gifts?
	/**
	 * The name of the user who sent the original gift.
	 */
	get gifterName(): string {
		return this._info.gifter;
	}

	/**
	 * The display name of the user who sent the original gift.
	 */
	get gifterDisplayName(): string {
		return this._info.gifterDisplayName;
	}

	/**
	 * Gets more information about the user who sent the original gift.
	 */
	async getGifter(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.gifterName));
	}

	/**
	 * The full object that contains all the message information.
	 */
	get messageObject(): UserNotice {
		return this._msg;
	}
}
