import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot.js';

/**
 * An event representing unique chat mode being toggled in a channel.
 *
 * @meta category events
 */
@rtfm<UniqueChatToggleEvent>('easy-bot', 'UniqueChatToggleEvent', 'broadcasterName')
export class UniqueChatToggleEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _enabled: boolean;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, enabled: boolean, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._enabled = enabled;
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
	 * Whether unique chat mode was enabled.
	 *
	 * `true` means it was enabled, `false` means it was disabled.
	 */
	get enabled(): boolean {
		return this._enabled;
	}

	/**
	 * Enables unique chat mode in the channel.
	 */
	async enable(): Promise<void> {
		await this._bot.enableUniqueChat(this.broadcasterName);
	}

	/**
	 * Disables unique chat mode in the channel.
	 */
	async disable(): Promise<void> {
		await this._bot.disableUniqueChat(this.broadcasterName);
	}
}
