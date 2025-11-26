import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot.js';

/**
 * An event representing slow mode being toggled in a channel.
 *
 * @meta category events
 */
@rtfm<SlowModeToggleEvent>('easy-bot', 'SlowModeToggleEvent', 'broadcasterName')
export class SlowModeToggleEvent {
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
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.broadcasterName));
	}

	/**
	 * Whether slow mode was enabled.
	 *
	 * `true` means it was enabled, `false` means it was disabled.
	 */
	get enabled(): boolean {
		return this._enabled;
	}

	/**
	 * The time (in seconds) a user has to wait after sending a message to send another one.
	 */
	get delay(): number | null {
		return this._delay ?? null;
	}

	/**
	 * Enables slow mode in the channel.
	 *
	 * @param delay The time (in seconds) a user has to wait after sending a message to send another one.
	 */
	async enable(delay: number = 30): Promise<void> {
		await this._bot.enableSlowMode(this.broadcasterName, delay);
	}

	/**
	 * Disables slow mode in the channel.
	 */
	async disable(): Promise<void> {
		await this._bot.disableSlowMode(this.broadcasterName);
	}
}
