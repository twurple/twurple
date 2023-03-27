import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ClearMsg, toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<MessageRemoveEvent>('easy-bot', 'MessageRemoveEvent', 'broadcasterName')
export class MessageRemoveEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _messageId: string;
	@Enumerable(false) private readonly _msg: ClearMsg;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, messageId: string, msg: ClearMsg, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._messageId = messageId;
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

	get userName(): string {
		return this._msg.userName;
	}

	get messageId(): string {
		return this._messageId;
	}

	get originalText(): string {
		return this._msg.params.message;
	}

	get messageObject(): ClearMsg {
		return this._msg;
	}
}
