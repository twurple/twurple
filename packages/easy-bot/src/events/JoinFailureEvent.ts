import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<JoinFailureEvent>('easy-bot', 'JoinFailureEvent', 'broadcasterName')
export class JoinFailureEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _reason: string;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, reason: string, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._reason = reason;
		this._bot = bot;
	}

	get broadcasterName(): string {
		return this._broadcasterName;
	}

	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserByName(this.broadcasterName));
	}

	get reason(): string {
		return this._reason;
	}

	async retry(): Promise<void> {
		await this._bot.join(this.broadcasterName);
	}
}
