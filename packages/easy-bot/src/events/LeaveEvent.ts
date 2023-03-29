import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing a user leaving a channel.
 *
 * The join/leave events are cached by the Twitch chat server and will be batched and sent every 30-60 seconds.
 *
 * Please note that if you have not enabled the `requestMembershipEvents` option
 * or the channel has more than 1000 connected chatters, this will only react to your own joins.
 *
 * @meta category events
 */
@rtfm<LeaveEvent>('easy-bot', 'LeaveEvent', 'broadcasterName')
export class LeaveEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _userName: string;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, userName: string, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
		this._bot = bot;
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
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.broadcasterName));
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this._userName;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.userName));
	}

	/**
	 * Joins the channel again.
	 */
	async join(): Promise<void> {
		await this._bot.join(this.broadcasterName);
	}
}
