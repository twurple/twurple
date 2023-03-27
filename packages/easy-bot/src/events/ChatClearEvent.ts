import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ClearChat, toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<ChatClearEvent>('easy-bot', 'ChatClearEvent', 'broadcasterId')
export class ChatClearEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _msg: ClearChat;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, msg: ClearChat, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._msg = msg;
		this._bot = bot;
	}

	get broadcasterId(): string {
		return this._msg.channelId;
	}

	get broadcasterName(): string {
		return this._broadcasterName;
	}

	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
	}

	get messageObject(): ClearChat {
		return this._msg;
	}
}
