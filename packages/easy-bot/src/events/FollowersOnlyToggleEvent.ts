import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing followers-only mode being toggled in a channel.
 *
 * @meta category events
 */
@rtfm<FollowersOnlyToggleEvent>('easy-bot', 'FollowersOnlyToggleEvent', 'broadcasterName')
export class FollowersOnlyToggleEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _enabled: boolean;
	/** @internal */ @Enumerable(false) private readonly _delay?: number;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, enabled: boolean, delay: number | undefined, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._enabled = enabled;
		this._delay = delay;
		this._bot = bot;
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
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.broadcasterName));
	}

	/**
	 * Whether followers-only mode was enabled.
	 *
	 * `true` means it was enabled, `false` means it was disabled.
	 */
	get enabled(): boolean {
		return this._enabled;
	}

	/**
	 * The time (in minutes) a user needs to follow the channel in order to be able to send messages in its chat.
	 *
	 * There needs to be a distinction between the values `0` (a user can chat immediately after following)
	 * and `null` (followers-only mode was disabled).
	 */
	get delay(): number | null {
		return this._delay ?? null;
	}

	/**
	 * Enables followers-only mode in the channel.
	 *
	 * @param delay The time (in minutes) a user needs to follow the channel in order to be able to send messages.
	 */
	async enable(delay: number = 0): Promise<void> {
		await this._bot.enableFollowersOnly(this.broadcasterName, delay);
	}

	/**
	 * Disables followers-only mode in the channel.
	 */
	async disable(): Promise<void> {
		await this._bot.disableFollowersOnly(this.broadcasterName);
	}
}
