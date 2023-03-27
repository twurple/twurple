import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<UniqueChatToggleEvent>('easy-bot', 'UniqueChatToggleEvent', 'broadcasterName')
export class UniqueChatToggleEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _enabled: boolean;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, enabled: boolean, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._enabled = enabled;
		this._bot = bot;
	}

	get broadcasterName(): string {
		return this._broadcasterName;
	}

	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.broadcasterName));
	}

	get enabled(): boolean {
		return this._enabled;
	}

	async enable(): Promise<void> {
		await this._bot.enableUniqueChat(this.broadcasterName);
	}

	async disable(): Promise<void> {
		await this._bot.disableUniqueChat(this.broadcasterName);
	}
}
