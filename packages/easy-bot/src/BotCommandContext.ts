import { type PrivateMessage } from '@twurple/chat';
import { type CommercialLength } from '@twurple/common';
import { type Bot, type ChatAnnouncementColor } from './Bot';

export class BotCommandContext {
	/** @private **/
	constructor(private readonly _bot: Bot, public readonly msg: PrivateMessage) {}

	get channelId(): string {
		return this.msg.channelId!;
	}

	get channel(): string {
		return this.msg.params.target;
	}

	get userId(): string {
		return this.msg.userInfo.userId;
	}

	get user(): string {
		return this.msg.userInfo.userName;
	}

	action = async (text: string): Promise<void> => await this._bot.action(this.channel, text);
	announce = async (text: string, color?: ChatAnnouncementColor): Promise<void> =>
		await this._bot.announceById(this.msg.channelId!, text, color);
	ban = async (reason: string): Promise<void> => await this._bot.banByIds(this.channelId, this.userId, reason);
	clear = async (): Promise<void> => await this._bot.clearById(this.channelId);
	runCommercial = async (length: CommercialLength = 30): Promise<void> =>
		await this._bot.runCommercialById(this.channelId, length);
	delete = async (): Promise<void> => await this._bot.deleteMessageById(this.channelId, this.msg.id);
	enableEmoteOnly = async (): Promise<void> => await this._bot.enableEmoteOnlyById(this.channelId);
	disableEmoteOnly = async (): Promise<void> => await this._bot.disableEmoteOnlyById(this.channelId);
	enableFollowersOnly = async (minFollowTime: number = 0): Promise<void> =>
		await this._bot.enableFollowersOnlyById(this.channelId, minFollowTime);
	disableFollowersOnly = async (): Promise<void> => await this._bot.disableFollowersOnlyById(this.channelId);
	enableUniqueChat = async (): Promise<void> => await this._bot.enableUniqueChatById(this.channelId);
	disableUniqueChat = async (): Promise<void> => await this._bot.disableUniqueChatById(this.channelId);
	enableSlow = async (delayBetweenMessages: number = 30): Promise<void> =>
		await this._bot.enableSlowById(this.channelId, delayBetweenMessages);
	disableSlow = async (): Promise<void> => await this._bot.disableSlowById(this.channelId);
	enableSubsOnly = async (): Promise<void> => await this._bot.enableSubsOnlyById(this.channelId);
	disableSubsOnly = async (): Promise<void> => await this._bot.disableSubsOnlyById(this.channelId);
	addVip = async (): Promise<void> => await this._bot.addVipByIds(this.channelId, this.userId);
	removeVip = async (): Promise<void> => await this._bot.removeVipByIds(this.channelId, this.userId);
	timeout = async (duration: number = 30, reason: string = ''): Promise<void> =>
		await this._bot.timeoutByIds(this.channelId, this.userId, duration, reason);
	purge = async (reason: string = ''): Promise<void> =>
		await this._bot.purgeByIds(this.channelId, this.userId, reason);
	reply = async (text: string): Promise<void> => await this._bot.say(this.channel, text, { replyTo: this.msg.id });
	say = async (text: string): Promise<void> => await this._bot.say(this.channel, text);
}
