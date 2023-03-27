import { Enumerable } from '@d-fischer/shared-utils';
import { type HelixUser } from '@twurple/api';
import { type ClearChat, toUserName } from '@twurple/chat';
import { checkRelationAssertion, HellFreezesOverError, rtfm } from '@twurple/common';
import { type Bot } from '../Bot';

@rtfm<BanEvent>('easy-bot', 'BanEvent', 'userId')
export class BanEvent {
	@Enumerable(false) private readonly _broadcasterName: string;
	@Enumerable(false) private readonly _userName: string;
	@Enumerable(false) private readonly _duration: number | null;
	@Enumerable(false) private readonly _msg: ClearChat;
	@Enumerable(false) private readonly _bot: Bot;

	constructor(channel: string, userName: string, duration: number | null, msg: ClearChat, bot: Bot) {
		this._broadcasterName = toUserName(channel);
		this._userName = userName;
		this._duration = duration;
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

	get userId(): string {
		if (!this._msg.targetUserId) {
			throw new HellFreezesOverError('Ban event without target user received');
		}
		return this._msg.targetUserId;
	}

	get userName(): string {
		return this._userName;
	}

	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._bot.api.users.getUserById(this.userId));
	}

	get duration(): number | null {
		return this._duration;
	}

	async unban(): Promise<void> {
		await this._bot.unbanByIds(this.broadcasterId, this.userId);
	}

	get messageObject(): ClearChat {
		return this._msg;
	}
}
