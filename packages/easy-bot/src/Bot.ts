import { LogLevel } from '@d-fischer/logger';
import { Enumerable, type ResolvableValue } from '@d-fischer/shared-utils';
import { EventEmitter } from '@d-fischer/typed-event-emitter';
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
import { AnnouncementEvent } from './events/AnnouncementEvent';
import { BanEvent } from './events/BanEvent';
import { BitsBadgeUpgradeEvent } from './events/BitsBadgeUpgradeEvent';
import { ChatClearEvent } from './events/ChatClearEvent';
import { CommunityPayForwardEvent } from './events/CommunityPayForwardEvent';
import { CommunitySubEvent } from './events/CommunitySubEvent';
import { EmoteOnlyToggleEvent } from './events/EmoteOnlyToggleEvent';
import { FollowersOnlyToggleEvent } from './events/FollowersOnlyToggleEvent';
import { GiftPaidUpgradeEvent } from './events/GiftPaidUpgradeEvent';
import { JoinEvent } from './events/JoinEvent';
import { JoinFailureEvent } from './events/JoinFailureEvent';
import { LeaveEvent } from './events/LeaveEvent';
import { MessageEvent } from './events/MessageEvent';
import { MessageRemoveEvent } from './events/MessageRemoveEvent';
import { PrimePaidUpgradeEvent } from './events/PrimePaidUpgradeEvent';
import { RaidCancelEvent } from './events/RaidCancelEvent';
import { RaidEvent } from './events/RaidEvent';
import { SlowModeToggleEvent } from './events/SlowModeToggleEvent';
import { StandardPayForwardEvent } from './events/StandardPayForwardEvent';
import { SubEvent } from './events/SubEvent';
import { SubGiftEvent } from './events/SubGiftEvent';
import { SubsOnlyToggleEvent } from './events/SubsOnlyToggleEvent';
import { UniqueChatToggleEvent } from './events/UniqueChatToggleEvent';
import { WhisperEvent } from './events/WhisperEvent';

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
	 * Whether to receive `onMessage` events for message that were already handled as a command.
	 */
	emitCommandMessageEvents?: boolean;

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
export class Bot extends EventEmitter {
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

	// region events
	/**
	 * Fires when the client successfully connects to the chat server.
	 *
	 * @eventListener
	 */
	readonly onConnect = this.registerEvent<[]>();

	/**
	 * Fires when the client disconnects from the chat server.
	 *
	 * @eventListener
	 * @param manually Whether the disconnect was requested by the user.
	 * @param reason The error that caused the disconnect, or `undefined` if there was no error.
	 */
	readonly onDisconnect = this.registerEvent<[manually: boolean, reason?: Error]>();

	/**
	 * Fires when a user is timed out from a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onTimeout = this.registerEvent<[event: BanEvent]>();

	/**
	 * Fires when a user is permanently banned from a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onBan = this.registerEvent<[event: BanEvent]>();

	/**
	 * Fires when a user upgrades their bits badge in a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onBitsBadgeUpgrade = this.registerEvent<[event: BitsBadgeUpgradeEvent]>();

	/**
	 * Fires when the chat of a channel is cleared.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onChatClear = this.registerEvent<[event: ChatClearEvent]>();

	/**
	 * Fires when emote-only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onEmoteOnlyToggle = this.registerEvent<[event: EmoteOnlyToggleEvent]>();

	/**
	 * Fires when followers-only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onFollowersOnlyToggle = this.registerEvent<[event: FollowersOnlyToggleEvent]>();

	/**
	 * Fires when a user joins a channel.
	 *
	 * The join/leave events are cached by the Twitch chat server and will be batched and sent every 30-60 seconds.
	 *
	 * Please note that if you have not enabled the `requestMembershipEvents` option
	 * or the channel has more than 1000 connected chatters, this will only react to your own joins.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onJoin = this.registerEvent<[event: JoinEvent]>();

	/**
	 * Fires when you fail to join a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onJoinFailure = this.registerEvent<[event: JoinFailureEvent]>();

	/**
	 * Fires when a user leaves ("parts") a channel.
	 *
	 * The join/leave events are cached by the Twitch chat server and will be batched and sent every 30-60 seconds.
	 *
	 * Please note that if you have not enabled the `requestMembershipEvents` option
	 * or the channel has more than 1000 connected chatters, this will only react to your own leaves.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onLeave = this.registerEvent<[event: LeaveEvent]>();

	/**
	 * Fires when a single message is removed from a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onMessageRemove = this.registerEvent<[event: MessageRemoveEvent]>();

	/**
	 * Fires when R9K mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onUniqueChatToggle = this.registerEvent<[event: UniqueChatToggleEvent]>();

	/**
	 * Fires when a user raids a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onRaid = this.registerEvent<[event: RaidEvent]>();

	/**
	 * Fires when a user cancels a raid.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onRaidCancel = this.registerEvent<[event: RaidCancelEvent]>();

	/**
	 * Fires when slow mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onSlowModeToggle = this.registerEvent<[event: SlowModeToggleEvent]>();

	/**
	 * Fires when sub only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onSubsOnlyToggle = this.registerEvent<[event: SubsOnlyToggleEvent]>();

	/**
	 * Fires when a user subscribes to a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onSub = this.registerEvent<[event: SubEvent]>();

	/**
	 * Fires when a user resubscribes to a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onResub = this.registerEvent<[event: SubEvent]>();

	/**
	 * Fires when a user gifts a subscription to a channel to another user.
	 *
	 * Community subs also fire multiple `onSubGift` events.
	 * To prevent alert spam, check the [example on how to handle sub gift spam](/docs/examples/chat/sub-gift-spam).
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onSubGift = this.registerEvent<[event: SubGiftEvent]>();

	/**
	 * Fires when a user gifts random subscriptions to the community of a channel.
	 *
	 * Community subs also fire multiple `onSubGift` events.
	 * To prevent alert spam, check the [example on how to handle sub gift spam](/docs/examples/chat/sub-gift-spam).
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onCommunitySub = this.registerEvent<[event: CommunitySubEvent]>();

	/**
	 * Fires when a user upgrades their Prime subscription to a paid subscription in a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onPrimePaidUpgrade = this.registerEvent<[event: PrimePaidUpgradeEvent]>();

	/**
	 * Fires when a user upgrades their gift subscription to a paid subscription in a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onGiftPaidUpgrade = this.registerEvent<[event: GiftPaidUpgradeEvent]>();

	/**
	 * Fires when a user pays forward a subscription that was gifted to them to a specific user.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onStandardPayForward = this.registerEvent<[event: StandardPayForwardEvent]>();

	/**
	 * Fires when a user pays forward a subscription that was gifted to them to the community.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onCommunityPayForward = this.registerEvent<[event: CommunityPayForwardEvent]>();

	/**
	 * Fires when a user sends an announcement (/announce) to a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onAnnouncement = this.registerEvent<[event: AnnouncementEvent]>();

	/**
	 * Fires when receiving a whisper from another user.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onWhisper = this.registerEvent<[event: WhisperEvent]>();

	/**
	 * Fires when authentication succeeds.
	 *
	 * @eventListener
	 */
	readonly onAuthenticationSuccess = this.registerEvent<[]>();

	/**
	 * Fires when authentication fails.
	 *
	 * @eventListener
	 * @param channel The channel that a command without sufficient permissions was executed on.
	 * @param text The message text.
	 */
	readonly onAuthenticationFailure = this.registerEvent<[text: string, retryCount: number]>();

	/**
	 * Fires when fetching a token fails.
	 *
	 * @eventListener
	 * @param error The error that was thrown.
	 */
	readonly onTokenFetchFailure = this.registerEvent<[error: Error]>();

	/**
	 * Fires when sending a message fails.
	 *
	 * @eventListener
	 * @param channel The channel that rejected the message.
	 * @param reason The reason for the failure, e.g. you're banned (msg_banned)
	 */
	readonly onMessageFailed = this.registerEvent<[channel: string, reason: string]>();

	/**
	 * Fires when a user sends a message to a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onMessage = this.registerEvent<[event: MessageEvent]>();

	/**
	 * Fires when a user sends an action (/me) to a channel.
	 *
	 * @eventListener
	 * @param event The event object.
	 */
	readonly onAction = this.registerEvent<[event: MessageEvent]>();
	// endregion

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
		const {
			auth,
			authProvider,
			authMethod,
			channel: configChannel,
			channels,
			debug,
			commands,
			emitCommandMessageEvents,
			prefix
		} = config;
		if (!auth && !authProvider) {
			throw new Error('You should pass an auth provider using the `authProvider` configuration option');
		}

		super();

		const resolvableChannels = configChannel ? [configChannel] : channels;

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

		this.chat.onMessage(async (channel, user, text, msg) => {
			const match = this._findMatch(msg);
			if (match !== null) {
				await match.command.execute(match.params, new BotCommandContext(this, msg));
			}
			if (match === null || emitCommandMessageEvents) {
				this.emit(this.onMessage, new MessageEvent(channel, user, text, false, msg, this));
			}
		});

		// region event redirection
		this.chat.onConnect(() => this.emit(this.onConnect));
		this.chat.onDisconnect((manually, reason) => this.emit(this.onDisconnect, manually, reason));
		this.chat.onAuthenticationSuccess(() => this.emit(this.onAuthenticationSuccess));
		this.chat.onAuthenticationFailure((text, retryCount) =>
			this.emit(this.onAuthenticationFailure, text, retryCount)
		);
		this.chat.onTokenFetchFailure(error => this.emit(this.onTokenFetchFailure, error));
		this.chat.onMessageFailed((channel, text) => this.emit(this.onMessageFailed, channel, text));

		this.chat.onTimeout((channel, user, duration, msg) =>
			this.emit(this.onTimeout, new BanEvent(channel, user, duration, msg, this))
		);
		this.chat.onBan((channel, user, msg) => this.emit(this.onBan, new BanEvent(channel, user, null, msg, this)));
		this.chat.onBitsBadgeUpgrade((channel, user, upgradeInfo, msg) =>
			this.emit(this.onBitsBadgeUpgrade, new BitsBadgeUpgradeEvent(channel, user, upgradeInfo, msg, this))
		);
		this.chat.onChatClear((channel, msg) => this.emit(this.onChatClear, new ChatClearEvent(channel, msg, this)));
		this.chat.onEmoteOnly((channel, enabled) =>
			this.emit(this.onEmoteOnlyToggle, new EmoteOnlyToggleEvent(channel, enabled, this))
		);
		this.chat.onFollowersOnly((channel, enabled, delay) =>
			this.emit(this.onFollowersOnlyToggle, new FollowersOnlyToggleEvent(channel, enabled, delay, this))
		);
		this.chat.onJoin((channel, user) => this.emit(this.onJoin, new JoinEvent(channel, user, this)));
		this.chat.onJoinFailure((channel, reason) =>
			this.emit(this.onJoinFailure, new JoinFailureEvent(channel, reason, this))
		);
		this.chat.onPart((channel, user) => this.emit(this.onLeave, new LeaveEvent(channel, user, this)));
		this.chat.onMessageRemove((channel, messageId, msg) =>
			this.emit(this.onMessageRemove, new MessageRemoveEvent(channel, messageId, msg, this))
		);
		this.chat.onR9k((channel, enabled) =>
			this.emit(this.onUniqueChatToggle, new UniqueChatToggleEvent(channel, enabled, this))
		);
		this.chat.onRaid((channel, user, raidInfo, msg) =>
			this.emit(this.onRaid, new RaidEvent(channel, user, raidInfo, msg, this))
		);
		this.chat.onRaidCancel((channel, msg) => this.emit(this.onRaidCancel, new RaidCancelEvent(channel, msg, this)));
		this.chat.onSlow((channel, enabled, delay) =>
			this.emit(this.onSlowModeToggle, new SlowModeToggleEvent(channel, enabled, delay, this))
		);
		this.chat.onSubsOnly((channel, enabled) =>
			this.emit(this.onSubsOnlyToggle, new SubsOnlyToggleEvent(channel, enabled, this))
		);
		this.chat.onSub((channel, user, subInfo, msg) =>
			this.emit(this.onSub, new SubEvent(channel, user, subInfo, msg, this))
		);
		this.chat.onResub((channel, user, subInfo, msg) =>
			this.emit(this.onResub, new SubEvent(channel, user, subInfo, msg, this))
		);
		this.chat.onSubGift((channel, user, subInfo, msg) =>
			this.emit(this.onSubGift, new SubGiftEvent(channel, user, subInfo, msg, this))
		);
		this.chat.onCommunitySub((channel, user, subInfo, msg) =>
			this.emit(this.onCommunitySub, new CommunitySubEvent(channel, subInfo, msg, this))
		);
		this.chat.onPrimePaidUpgrade((channel, user, subInfo, msg) =>
			this.emit(this.onPrimePaidUpgrade, new PrimePaidUpgradeEvent(channel, user, subInfo, msg, this))
		);
		this.chat.onGiftPaidUpgrade((channel, user, subInfo, msg) =>
			this.emit(this.onGiftPaidUpgrade, new GiftPaidUpgradeEvent(channel, user, subInfo, msg, this))
		);
		this.chat.onStandardPayForward((channel, user, forwardInfo, msg) =>
			this.emit(this.onStandardPayForward, new StandardPayForwardEvent(channel, user, forwardInfo, msg, this))
		);
		this.chat.onCommunityPayForward((channel, user, forwardInfo, msg) =>
			this.emit(this.onCommunityPayForward, new CommunityPayForwardEvent(channel, user, forwardInfo, msg, this))
		);
		this.chat.onAnnouncement((channel, user, announcementInfo, msg) =>
			this.emit(this.onAnnouncement, new AnnouncementEvent(channel, user, announcementInfo, msg, this))
		);

		this.chat.onWhisper((user, text, msg) => this.emit(this.onWhisper, new WhisperEvent(user, text, msg, this)));
		this.chat.onAction((channel, user, text, msg) =>
			this.emit(this.onAction, new MessageEvent(channel, user, text, true, msg, this))
		);
		// endregion

		void this.chat.connect();
	}

	// region chat management commands
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

	/**
	 * Unban a user from a channel.
	 *
	 * @param channelName The name of the channel to unban the user from.
	 * @param userName The name of the user to unban.
	 */
	async unban(channelName: string, userName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		const userId = await this._resolveUserId(userName);
		await this.unbanByIds(channelId, userId);
	}

	/**
	 * Unbans a user from a channel using the channel and user IDs.
	 *
	 * @param channel The channel to unban the user from.
	 * @param user The user to unban.
	 */
	async unbanByIds(channel: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this.api.moderation.unbanUser(channel, await this._getPreferredUserIdForModAction(channel), user);
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

	async enableSlowMode(channelName: string, delayBetweenMessages: number = 0): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.enableSlowModeById(channelId, delayBetweenMessages);
	}

	async enableSlowModeById(channel: UserIdResolvable, delayBetweenMessages: number = 0): Promise<void> {
		await this._updateChannelSettings(channel, {
			slowModeEnabled: true,
			slowModeDelay: delayBetweenMessages
		});
	}

	async disableSlowMode(channelName: string): Promise<void> {
		const channelId = await this._resolveUserId(channelName);
		await this.disableSlowModeById(channelId);
	}

	async disableSlowModeById(channel: UserIdResolvable): Promise<void> {
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

	// endregion

	// region getter commands
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

	// endregion

	// region chat messaging
	async join(channel: string): Promise<void> {
		await this.chat.join(channel);
	}

	leave(channel: string): void {
		this.chat.part(channel);
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

	async whisper(targetName: string, text: string): Promise<void> {
		await this.whisperById(await this._resolveUserId(targetName), text);
	}

	async whisperById(target: UserIdResolvable, text: string): Promise<void> {
		await this.api.whispers.sendWhisper(await this._getBotUserId(), target, text);
	}

	// endregion

	// region internals
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

	// endregion
}
