import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ClearChat, toUserName } from '@twurple/chat';
import { checkRelationAssertion, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

/**
 * An event representing the chat of a channel getting cleared.
 *
 * @meta category events
 */
@rtfm<ChatClearEvent>('easy-bot', 'ChatClearEvent', 'broadcasterId')
export class ChatClearEvent {
	/** @internal */ @Enumerable(false) private readonly _broadcasterName: string;
	/** @internal */ @Enumerable(false) private readonly _msg: ClearChat;
	/** @internal */ @Enumerable(false) private readonly _bot: Bot;

	/** @internal */
	constructor(channel: string, msg: ClearChat, bot: Bot) {
		this._broadcasterName = toUserName(channel);
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
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.broadcasterId));
	}

	/**
	 * The full object that contains all the message information.
	 */
	get messageObject(): ClearChat {
		return this._msg;
	}
}
