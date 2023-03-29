import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing subscriber-only mode being toggled in a channel.
 *
 * @meta category events
 */
@rtfm<SubsOnlyToggleEvent>('easy-bot', 'SubsOnlyToggleEvent', 'broadcasterName')
export class SubsOnlyToggleEvent {
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
	 * Whether subscriber-only mode was enabled.
	 *
	 * `true` means it was enabled, `false` means it was disabled.
	 */
	get enabled(): boolean {
		return this._enabled;
	}

	/**
	 * Enables subscriber-only mode in the channel.
	 */
	async enable(): Promise<void> {
		await this._bot.enableSubsOnly(this.broadcasterName);
	}

	/**
	 * Disables subscriber-only mode in the channel.
	 */
	async disable(): Promise<void> {
		await this._bot.disableSubsOnly(this.broadcasterName);
	}
}
