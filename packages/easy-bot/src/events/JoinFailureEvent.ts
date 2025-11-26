import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot.js';

/**
 * An event representing the bot failing to join a channel.
 *
 * @meta category events
 */
@rtfm<JoinFailureEvent>('easy-bot', 'JoinFailureEvent', 'broadcasterName')
export class JoinFailureEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _reason: string;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, reason: string, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._reason = reason;
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
	 * The reason why the join failed.
	 */
	get reason(): string {
		return this._reason;
	}

	/**
	 * Tries to join again.
	 */
	async retry(): Promise<void> {
		await this._bot.join(this.broadcasterName);
	}
}
