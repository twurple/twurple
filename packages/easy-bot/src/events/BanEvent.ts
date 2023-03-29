import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ClearChat, toUserName } from '@twurple/chat';
import { checkRelationAssertion, HellFreezesOverError, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing a user getting banned from a channel.
 *
 * @meta category events
 */
@rtfm<BanEvent>('easy-bot', 'BanEvent', 'userId')
export class BanEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _userName: string;
	/** @internal */ @Enumerable(false) private readonly _duration: number | null;
	/** @internal */ @Enumerable(false) private readonly _msg: ClearChat;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, userName: string, duration: number | null, msg: ClearChat, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
		this._duration = duration;
		this._msg = msg;
		this._bot = bot;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._msg.channelId;
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
	 * The ID of the user who was banned.
	 */
	get userId(): string {
		if (!this._msg.targetUserId) {
			throw new HellFreezesOverError('Ban event without target user received');
		}
		return this._msg.targetUserId;
	}

	/**
	 * The name of the user who was banned.
	 */
	get userName(): string {
		return this._userName;
	}

	/**
	 * Gets more information about the user who was banned.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	/**
	 * The duration of the ban, or `null` if it's permanent.
	 */
	get duration(): number | null {
		return this._duration;
	}

	/**
	 * Remove the ban.
	 */
	async unban(): Promise<void> {
		await this._bot.unbanByIds(this.broadcasterId, this.userId);
	}

	/**
	 * The full object that contains all the message information.
	 */
	get messageObject(): ClearChat {
		return this._msg;
	}
}
