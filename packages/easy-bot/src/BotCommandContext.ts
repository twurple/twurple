import { type ChatMessage, toUserName } from '@twurple/chat';
import { type CommercialLength } from '@twurple/common';
import { type Bot, type ChatAnnouncementColor } from './Bot';

/**
 * The message context of a bot command execution handler.
 *
 * @meta category main
 */
export class BotCommandContext {
	/** @internal **/
	constructor(private readonly _bot: Bot, public readonly msg: ChatMessage) {}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this.msg.channelId!;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return toUserName(this.msg.target);
	}

	/**
	 * The ID of the user who sent the message.
	 */
	get userId(): string {
		return this.msg.userInfo.userId;
	}

	/**
	 * The name of the user who sent the message.
	 */
	get userName(): string {
		return this.msg.userInfo.userName;
	}

	/**
	 * The display name of the user who sent the message.
	 */
	get userDisplayName(): string {
		return this.msg.userInfo.displayName;
	}

	/**
	 * Sends an action (/me) to the channel.
	 *
	 * @param text The text to send.
	 */
	action = async (text: string): Promise<void> => await this._bot.action(this.broadcasterName, text);

	/**
	 * Sends an announcement to the channel.
	 *
	 * @param text The text to send.
	 * @param color The color to send the announcement in. If not passed, uses the default channel color.
	 */
	announce = async (text: string, color?: ChatAnnouncementColor): Promise<void> =>
		await this._bot.announceById(this.msg.channelId!, text, color);

	/**
	 * Bans the user who sent the message from the channel.
	 *
	 * @param reason The reason for the ban.
	 */
	ban = async (reason: string): Promise<void> => await this._bot.banByIds(this.broadcasterId, this.userId, reason);

	/**
	 * Removes all messages from the channel.
	 */
	clear = async (): Promise<void> => await this._bot.clearById(this.broadcasterId);

	/**
	 * Runs a commercial break on the channel.
	 *
	 * @param length The duration of the commercial break.
	 */
	runCommercial = async (length: CommercialLength = 30): Promise<void> =>
		await this._bot.runCommercialById(this.broadcasterId, length);

	/**
	 * Deletes the message from the channel.
	 */
	delete = async (): Promise<void> => await this._bot.deleteMessageById(this.broadcasterId, this.msg.id);

	/**
	 * Enables emote-only mode in the channel.
	 */
	enableEmoteOnly = async (): Promise<void> => await this._bot.enableEmoteOnlyById(this.broadcasterId);

	/**
	 * Disables emote-only mode in the channel.
	 */
	disableEmoteOnly = async (): Promise<void> => await this._bot.disableEmoteOnlyById(this.broadcasterId);

	/**
	 * Enables followers-only mode in the channel.
	 *
	 * @param minFollowTime The time (in minutes) a user needs to be following before being able to send messages.
	 */
	enableFollowersOnly = async (minFollowTime: number = 0): Promise<void> =>
		await this._bot.enableFollowersOnlyById(this.broadcasterId, minFollowTime);

	/**
	 * Disables followers-only mode in the channel.
	 */
	disableFollowersOnly = async (): Promise<void> => await this._bot.disableFollowersOnlyById(this.broadcasterId);

	/**
	 * Enables unique chat mode in the channel.
	 */
	enableUniqueChat = async (): Promise<void> => await this._bot.enableUniqueChatById(this.broadcasterId);

	/**
	 * Disables unique chat mode in the channel.
	 */
	disableUniqueChat = async (): Promise<void> => await this._bot.disableUniqueChatById(this.broadcasterId);

	/**
	 * Enables slow mode in the channel.
	 *
	 * @param delayBetweenMessages The time (in seconds) a user needs to wait between messages.
	 */
	enableSlow = async (delayBetweenMessages: number = 30): Promise<void> =>
		await this._bot.enableSlowModeById(this.broadcasterId, delayBetweenMessages);

	/**
	 * Disables slow mode in the channel.
	 */
	disableSlow = async (): Promise<void> => await this._bot.disableSlowModeById(this.broadcasterId);

	/**
	 * Enables subscribers-only mode in the channel.
	 */
	enableSubsOnly = async (): Promise<void> => await this._bot.enableSubsOnlyById(this.broadcasterId);

	/**
	 * Disables subscribers-only mode in the channel.
	 */
	disableSubsOnly = async (): Promise<void> => await this._bot.disableSubsOnlyById(this.broadcasterId);

	/**
	 * Gives the user VIP status in the channel.
	 */
	addVip = async (): Promise<void> => await this._bot.addVipByIds(this.broadcasterId, this.userId);

	/**
	 * Takes VIP status from the user in the channel.
	 */
	removeVip = async (): Promise<void> => await this._bot.removeVipByIds(this.broadcasterId, this.userId);

	/**
	 * Times out then user in the channel and removes all their messages.
	 *
	 * @param duration The time (in seconds) until the user can send messages again. Defaults to 1 minute.
	 * @param reason The reason for the timeout.
	 */
	timeout = async (duration: number = 30, reason: string = ''): Promise<void> =>
		await this._bot.timeoutByIds(this.broadcasterId, this.userId, duration, reason);

	/**
	 * Removes all messages of the user from the channel.
	 *
	 * @param reason The reason for the purge.
	 */
	purge = async (reason: string = ''): Promise<void> =>
		await this._bot.purgeByIds(this.broadcasterId, this.userId, reason);

	/**
	 * Sends a reply to the chat message to the channel.
	 *
	 * @param text The text to send.
	 */
	reply = async (text: string): Promise<void> =>
		await this._bot.say(this.broadcasterName, text, { replyTo: this.msg.id });

	/**
	 * Sends a regular chat message to the channel.
	 *
	 * @param text The text to send.
	 */
	say = async (text: string): Promise<void> => await this._bot.say(this.broadcasterName, text);
}
