import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName, type UserNotice } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing an outgoing raid being canceled.
 *
 * @meta category events
 */
@rtfm<RaidCancelEvent>('easy-bot', 'RaidCancelEvent', 'broadcasterName')
export class RaidCancelEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _msg: UserNotice;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, msg: UserNotice, bot: Bot) {
		this._broadcasterName = toUserName(channel);
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
	 * The ID of the user who canceled the raid.
	 */
	get userId(): string {
		return this._msg.userInfo.userId;
	}

	/**
	 * The name of the user who canceled the raid.
	 */
	get userName(): string {
		return this._msg.userInfo.userName;
	}

	/**
	 * The display name of the user who canceled the raid.
	 */
	get userDisplayName(): string {
		return this._msg.userInfo.displayName;
	}

	/**
	 * Gets more information about the user who canceled the raid.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	/**
	 * The full object that contains all the message information.
	 */
	get messageObject(): UserNotice {
		return this._msg;
	}
}
