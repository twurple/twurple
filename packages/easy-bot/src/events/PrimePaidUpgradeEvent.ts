import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ChatSubUpgradeInfo, toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing a free subscription from Prime Gaming being replaced by a paid one.
 *
 * @meta category events
 */
@rtfm<PrimePaidUpgradeEvent>('easy-bot', 'PrimePaidUpgradeEvent', 'userId')
export class PrimePaidUpgradeEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _userName: string;
	@Enumerable(false) private readonly _info: ChatSubUpgradeInfo;
	@Enumerable(false) private readonly _msg: UserNotice;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, userName: string, info: ChatSubUpgradeInfo, msg: UserNotice, bot: Bot) {
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

	/**
	 * The plan of the subscription.
	 */
	get plan(): string {
		return this._info.plan;
	}

	/**
	 * The full object that contains all the message information.
	 */
	get messageObject(): UserNotice {
		return this._msg;
	}
}
