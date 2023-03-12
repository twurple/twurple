import { LogLevel } from '@d-fischer/logger';
import { Enumerable, type ResolvableValue } from '@d-fischer/shared-utils';
import {
	ApiClient,
	type HelixChatAnnouncementColor,
	type HelixChatUserColor,
	type HelixModerator,
	type HelixUpdateChatSettingsParams,
	type HelixUserRelation
} from '@twurple/api';
import { type AuthProvider } from '@twurple/auth';
import {
	ChatClient,
	type ChatSayMessageAttributes,
	extractMessageId,
	type PrivateMessage,
	toUserName
} from '@twurple/chat';
import { type CommercialLength, HellFreezesOverError, type UserIdResolvable } from '@twurple/common';
import { type BotCommand, type BotCommandMatch } from './BotCommand';
import { BotCommandContext } from './BotCommandContext';

export type BotAuthMethod = 'bot' | 'broadcaster';

/**
 * The bot configuration.
 */
export interface BotConfig {
	/**
	 * @deprecated Use `authProvider` instead.
	 */
	auth?: AuthProvider;

	/**
	 * The {@link AuthProvider} instance to use for authenticating the bot and its users.
	 */
	authProvider?: AuthProvider;

	/**
	 * Whether to enable debug logs.
	 */
	debug?: boolean;

	/**
	 * The channel to join.
	 *
	 * Takes priority over `channels`.
	 */
	channel?: string;

	/**
	 * The channels to join.
	 *
	 * Is ignored when `channel` is set.
	 */
	channels?: ResolvableValue<string[]>;

	/**
	 * The commands to register.
	 */
	commands?: BotCommand[];

	/**
	 * The prefix for all commands.
	 *
	 * Defaults to `!`.
	 */
	prefix?: string;

	/**
	 * The preferred authentication method for authorized actions such as moderation.
	 *
	 * Defaults to bot authentication.
	 *
	 * Some methods can only use broadcaster authentication - they will be marked as such.
	 */
	authMethod?: BotAuthMethod;
}

export type ChatAnnouncementColor = HelixChatAnnouncementColor;
export type ChatUserColor = HelixChatUserColor;

/**
 * Twitch chatbots made easy.
 */
export class Bot {
	/**
	 * Direct access to the underlying API client. Use at your own risk.
	 */
	readonly api: ApiClient;

	/**
	 * Direct access to the underlying chat client. Use at your own risk.
	 */
	readonly chat: ChatClient;

	@Enumerable(false) private readonly _authProvider: AuthProvider;
	private readonly _prefix: string;
	private readonly _authMethod: BotAuthMethod;

	private readonly _commands = new Map<string, BotCommand>();
	private _botUserIdPromise: Promise<string> | null = null;

	/**
	 * @deprecated Use the constructor directly instead.
	 *
	 * @expandParams
	 *
	 * @param config
	 */
	static async create(config: BotConfig): Promise<Bot> {
		if (!config.auth && !config.authProvider) {
			throw new Error('You have to pass an auth provider using the `authProvider` configuration option');
		}
		return new this(null, config);
	}

	/**
	 * Creates a new bot.
	 *
	 * @param _unused An unused parameter that will be removed in the next version. You can safely pass `null` here.
	 * @param config The configuration for the bot.
	 */
	constructor(_unused: AuthProvider | null | undefined, config: BotConfig) {
		const { auth, authProvider, authMethod, channel, channels, debug, commands, prefix } = config;
		if (!auth && !authProvider) {
			throw new Error('You should pass an auth provider using the `authProvider` configuration option');
		}

		const resolvableChannels = channel ? [channel] : channels;

		if (!resolvableChannels) {
			throw new Error("didn't pass channel nor channels option, exiting");
		}

		this._authProvider = authProvider ?? auth!;
		this._prefix = prefix ?? '!';
		this._authMethod = authMethod ?? 'bot';

		this._commands = new Map<string, BotCommand>(commands?.map(cmd => [cmd.name, cmd]));

		const minLevel = debug ? LogLevel.DEBUG : LogLevel.ERROR;
		this.api = new ApiClient({
			authProvider: this._authProvider,
			logger: { minLevel }
		});
		this.chat = new ChatClient({
			authProvider: this._authProvider,
			logger: { minLevel },
			channels: resolvableChannels
		});

		this.chat.onMessage(async (currentChannel, user, message, msg) => {
			const match = this._findMatch(msg);
			if (match !== null) {
				await match.command.execute(match.params, new BotCommandContext(this, msg));
			}
		});

		void this.chat.connect();
	}

	/**
	 * Sends an announcement to a channel.
	 *
	 * @param channelName The name of the channel to send the announcement to.
	 * @param text The text to send.
	 * @param color The color to send the announcement in. If not passed, uses the default channel color.
	 */
	async announce(channelName: string, text: string, color?: ChatAnnouncementColor): Promise<void> {
		await this.announceById(await this._resolveUserId(channelName), text, color);
	}

	/**
	 * Sends an announcement to a channel using its ID.
	 *
	 * @param channel The channel to send the announcement to.
	 * @param text The text to send.
	 * @param color The color to send the announcement in. If not passed, uses the default channel color.
	 */
	async announceById(channel: UserIdResolvable, text: string, color?: ChatAnnouncementColor): Promise<void> {
		await this.api.chat.sendAnnouncement(channel, await this._getPreferredUserIdForModAction(channel), {
			message: text,
			color
		});
	}

	/**
	 * Bans a user from a channel.
	 *
	 * @param channelName The name of the channel to ban the user from.
	 * @param userName The name of the user to ban.
	 * @param reason The reason for the ban.
	 */
	async ban(channelName: string, userName: string, reason: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		const userId = await this._resolveUserId(userName);
		await this.banByIds(channelId, userId, reason);
	}

	/**
	 * Bans a user from a channel using the channel and user IDs.
	 *
	 * @param channel The channel to ban the user from.
	 * @param user The user to ban.
	 * @param reason The reason for the ban.
	 */
	async banByIds(channel: UserIdResolvable, user: UserIdResolvable, reason: string): Promise<void> {
		await this.api.moderation.banUser(channel, await this._getPreferredUserIdForModAction(channel), {
			user,
			reason
		});
	}

	async clear(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.clearById(channelId);
	}

	async clearById(channel: UserIdResolvable): Promise<void> {
		await this.api.moderation.deleteChatMessages(channel, await this._getPreferredUserIdForModAction(channel));
	}

	async changeColor(color: ChatUserColor): Promise<void> {
		await this.api.chat.setColorForUser(await this._getBotUserId(), color);
	}

	async runCommercial(channelName: string, length: CommercialLength = 30): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.runCommercialById(channelId, length);
	}

	async runCommercialById(channel: UserIdResolvable, length: CommercialLength = 30): Promise<void> {
		await this.api.channels.startChannelCommercial(channel, length);
	}

	async deleteMessage(channelName: string, message: string | PrivateMessage): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.deleteMessageById(channelId, message);
	}

	async deleteMessageById(channel: UserIdResolvable, message: string | PrivateMessage): Promise<void> {
		await this.api.moderation.deleteChatMessages(
			channel,
			await this._getPreferredUserIdForModAction(channel),
			extractMessageId(message)
		);
	}

	async enableEmoteOnly(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.enableEmoteOnlyById(channelId);
	}

	async enableEmoteOnlyById(channel: UserIdResolvable): Promise<void> {
		await this._updateChannelSettings(channel, {
			emoteOnlyModeEnabled: true
		});
	}

	async disableEmoteOnly(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.disableEmoteOnlyById(channelId);
	}

	async disableEmoteOnlyById(channel: UserIdResolvable): Promise<void> {
		await this._updateChannelSettings(channel, {
			emoteOnlyModeEnabled: false
		});
	}

	async enableFollowersOnly(channelName: string, minFollowTime: number = 0): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.enableFollowersOnlyById(channelId, minFollowTime);
	}

	async enableFollowersOnlyById(channel: UserIdResolvable, minFollowTime: number = 0): Promise<void> {
		await this._updateChannelSettings(channel, {
			followerOnlyModeEnabled: true,
			followerOnlyModeDelay: minFollowTime
		});
	}

	async disableFollowersOnly(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.disableFollowersOnlyById(channelId);
	}

	async disableFollowersOnlyById(channel: UserIdResolvable): Promise<void> {
		await this._updateChannelSettings(channel, {
			followerOnlyModeEnabled: false
		});
	}

	async mod(channelName: string, userName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		const userId = await this._resolveUserId(userName);

		await this.modByIds(channelId, userId);
	}

	async modByIds(channel: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this.api.moderation.addModerator(channel, user);
	}

	async unmod(channelName: string, userName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		const userId = await this._resolveUserId(userName);

		await this.unmodByIds(channelId, userId);
	}

	async unmodByIds(channel: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this.api.moderation.removeModerator(channel, user);
	}

	async enableUniqueChat(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.enableUniqueChatById(channelId);
	}

	async enableUniqueChatById(channel: UserIdResolvable): Promise<void> {
		await this._updateChannelSettings(channel, {
			uniqueChatModeEnabled: true
		});
	}

	async disableUniqueChat(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.disableUniqueChatById(channelId);
	}

	async disableUniqueChatById(channel: UserIdResolvable): Promise<void> {
		await this._updateChannelSettings(channel, {
			uniqueChatModeEnabled: false
		});
	}

	async enableSlow(channelName: string, delayBetweenMessages: number = 0): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.enableSlowById(channelId, delayBetweenMessages);
	}

	async enableSlowById(channel: UserIdResolvable, delayBetweenMessages: number = 0): Promise<void> {
		await this._updateChannelSettings(channel, {
			slowModeEnabled: true,
			slowModeDelay: delayBetweenMessages
		});
	}

	async disableSlow(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.disableSlowById(channelId);
	}

	async disableSlowById(channel: UserIdResolvable): Promise<void> {
		await this._updateChannelSettings(channel, {
			slowModeEnabled: false
		});
	}

	async enableSubsOnly(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.enableSubsOnlyById(channelId);
	}

	async enableSubsOnlyById(channel: UserIdResolvable): Promise<void> {
		await this._updateChannelSettings(channel, {
			subscriberOnlyModeEnabled: true
		});
	}

	async disableSubsOnly(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.disableSubsOnlyById(channelId);
	}

	async disableSubsOnlyById(channel: UserIdResolvable): Promise<void> {
		await this._updateChannelSettings(channel, {
			subscriberOnlyModeEnabled: false
		});
	}

	async timeout(channelName: string, userName: string, duration: number = 60, reason: string = ''): Promise<void> {
		if (!Number.isInteger(duration) || duration < 1 || duration > 1209600) {
			throw new Error(`Invalid timeout duration: ${duration}. It must be an integer between 1 and 1209600.`);
		}

		const channelId = await this._resolveUserId(channelName);
		const userId = await this._resolveUserId(userName);
		await this.timeoutByIds(channelId, userId, duration, reason);
	}

	async timeoutByIds(
		channel: UserIdResolvable,
		user: UserIdResolvable,
		duration: number = 60,
		reason: string = ''
	): Promise<void> {
		if (!Number.isInteger(duration) || duration < 1 || duration > 1209600) {
			throw new Error(`Invalid timeout duration: ${duration}. It must be an integer between 1 and 1209600.`);
		}

		await this.api.moderation.banUser(channel, await this._getPreferredUserIdForModAction(channel), {
			user,
			reason,
			duration
		});
	}

	async purge(channelName: string, userName: string, reason: string = ''): Promise<void> {
		await this.timeout(channelName, userName, 1, reason);
	}

	async purgeByIds(channel: UserIdResolvable, user: UserIdResolvable, reason: string = ''): Promise<void> {
		await this.timeoutByIds(channel, user, 1, reason);
	}

	async addVip(channelName: string, userName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		const userId = await this._resolveUserId(userName);

		await this.addVipByIds(channelId, userId);
	}

	async addVipByIds(channel: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this.api.channels.addVip(channel, user);
	}

	async removeVip(channelName: string, userName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		const userId = await this._resolveUserId(userName);

		await this.removeVipByIds(channelId, userId);
	}

	async removeVipByIds(channel: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this.api.channels.removeVip(channel, user);
	}

	/**
	 * Sends a reply to another chat message to a channel.
	 *
	 * @param channel The channel to send the message to.
	 * @param text The text to send.
	 * @param replyToMessage The message (or ID of the message) to reply to.
	 */
	async reply(channel: string, text: string, replyToMessage: string | PrivateMessage): Promise<void> {
		await this.chat.say(channel, text, { replyTo: replyToMessage });
	}

	/**
	 * Sends a regular chat message to a channel.
	 *
	 * @param channel The channel to send the message to.
	 * @param text The text to send.
	 * @param attributes The attributes to add to the message.
	 */
	async say(channel: string, text: string, attributes: ChatSayMessageAttributes = {}): Promise<void> {
		await this.chat.say(channel, text, attributes);
	}

	/**
	 * Sends an action (/me) to a channel.
	 *
	 * @param channelName The name of the channel to send the action to.
	 * @param text The text to send.
	 */
	async action(channelName: string, text: string): Promise<void> {
		await this.chat.action(channelName, text);
	}

	async getMods(channelName: string): Promise<HelixModerator[]> {
		const channelId = await this._resolveUserId(channelName);

		return await this.getModsById(channelId);
	}

	async getModsById(channel: UserIdResolvable): Promise<HelixModerator[]> {
		return await this.api.moderation.getModeratorsPaginated(channel).getAll();
	}

	async getVips(channelName: string): Promise<HelixUserRelation[]> {
		const channelId = await this._resolveUserId(channelName);

		return await this.getVipsById(channelId);
	}

	async getVipsById(channel: UserIdResolvable): Promise<HelixUserRelation[]> {
		return await this.api.channels.getVipsPaginated(channel).getAll();
	}

	private _findMatch(msg: PrivateMessage): BotCommandMatch | null {
		const line = msg.params.content.trim().replace(/  +/g, ' ');
		for (const command of this._commands.values()) {
			const params = command.match(line, this._prefix);
			if (params !== null) {
				return {
					command,
					params
				};
			}
		}
		return null;
	}

	private async _getBotUserId(): Promise<string> {
		if (this._botUserIdPromise) {
			return await this._botUserIdPromise;
		}

		return await (this._botUserIdPromise = this.api
			.asIntent(['chat'], async ctx => await ctx.getTokenInfo())
			.then(tokenInfo => {
				if (!tokenInfo.userId) {
					throw new HellFreezesOverError('Bot token is not a user token');
				}
				return tokenInfo.userId;
			}));
	}

	private async _getPreferredUserIdForModAction(broadcaster: UserIdResolvable): Promise<UserIdResolvable> {
		if (this._authMethod === 'bot') {
			return await this._getBotUserId();
		}

		return broadcaster;
	}

	private async _resolveUserId(userNameOrChannel: string): Promise<string> {
		const userName = toUserName(userNameOrChannel);
		const user = await this.api.users.getUserByName(userName);

		if (!user) {
			throw new Error(`User ${userName} does not exist`);
		}

		return user.id;
	}

	private async _updateChannelSettings(
		channel: UserIdResolvable,
		settings: HelixUpdateChatSettingsParams
	): Promise<void> {
		await this.api.chat.updateSettings(channel, await this._getPreferredUserIdForModAction(channel), settings);
	}
}
