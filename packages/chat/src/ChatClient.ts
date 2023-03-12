import type { Logger, LoggerOptions } from '@d-fischer/logger';
import { createLogger, LogLevel } from '@d-fischer/logger';
import type { RateLimiter, RateLimiterRequestOptions } from '@d-fischer/rate-limiter';
import {
	PartitionedTimeBasedRateLimiter,
	TimeBasedRateLimiter,
	TimedPassthruRateLimiter
} from '@d-fischer/rate-limiter';
import type { ResolvableValue } from '@d-fischer/shared-utils';
import { delay, Enumerable, fibWithLimit, resolveConfigValue } from '@d-fischer/shared-utils';
import type { EventBinder } from '@d-fischer/typed-event-emitter';
import { EventEmitter } from '@d-fischer/typed-event-emitter';
import type { AccessToken, AuthProvider } from '@twurple/auth';
import {
	accessTokenIsExpired,
	getTokenInfo,
	InvalidTokenError,
	InvalidTokenTypeError,
	RefreshingAuthProvider
} from '@twurple/auth';
import { rtfm } from '@twurple/common';
import type { WebSocketConnectionOptions } from 'ircv3';
import { IrcClient, MessageTypes } from 'ircv3';
import { TwitchCommandsCapability } from './caps/twitchCommands';
import { ClearChat } from './caps/twitchCommands/messageTypes/ClearChat';
import { RoomState } from './caps/twitchCommands/messageTypes/RoomState';
import { UserNotice } from './caps/twitchCommands/messageTypes/UserNotice';
import { Whisper } from './caps/twitchCommands/messageTypes/Whisper';
import { TwitchMembershipCapability } from './caps/TwitchMembershipCapability';
import { TwitchTagsCapability } from './caps/twitchTags';
import { ClearMsg } from './caps/twitchTags/messageTypes/ClearMsg';
import type { ChatSayMessageAttributes } from './ChatMessageAttributes';
import { extractMessageId } from './ChatMessageAttributes';
import { TwitchPrivateMessage } from './commands/TwitchPrivateMessage';
import type { ChatAnnouncementInfo } from './userNotices/ChatAnnouncementInfo';
import type { ChatBitsBadgeUpgradeInfo } from './userNotices/ChatBitsBadgeUpgradeInfo';
import type { ChatCommunityPayForwardInfo } from './userNotices/ChatCommunityPayForwardInfo';
import type { ChatCommunitySubInfo } from './userNotices/ChatCommunitySubInfo';
import type { ChatPrimeCommunityGiftInfo } from './userNotices/ChatPrimeCommunityGiftInfo';
import type { ChatRaidInfo } from './userNotices/ChatRaidInfo';
import type { ChatRewardGiftInfo } from './userNotices/ChatRewardGiftInfo';
import type { ChatRitualInfo } from './userNotices/ChatRitualInfo';
import type { ChatStandardPayForwardInfo } from './userNotices/ChatStandardPayForwardInfo';
import type {
	ChatSubExtendInfo,
	ChatSubGiftInfo,
	ChatSubGiftUpgradeInfo,
	ChatSubInfo,
	ChatSubUpgradeInfo
} from './userNotices/ChatSubInfo';
import { splitOnSpaces } from './utils/messageUtil';
import { toChannelName } from './utils/userUtil';

/**
 * A Twitch bot level, i.e. whether you're connecting as a known or verified bot.
 */
export type TwitchBotLevel = 'none' | 'known' | 'verified';

/**
 * Options for a chat client.
 */
export interface ChatClientOptions {
	/**
	 * The authentication provider to use for getting the chat credentials.
	 *
	 * If you don't pass this, the chat client will connect anonymously.
	 */
	authProvider?: AuthProvider;

	/**
	 * Whether to request a token with only read permission.
	 *
	 * Ignored if `legacyScopes` is `true`.
	 */
	readOnly?: boolean;

	/**
	 * Whether to request a token with the old chat permission scope.
	 *
	 * If you're not sure whether this is necessary, just try leaving this off, and if it doesn't work, turn it on and try again.
	 */
	legacyScopes?: boolean;

	/**
	 * Options to pass to the logger.
	 */
	logger?: Partial<LoggerOptions>;

	/**
	 * Whether to connect securely using SSL.
	 *
	 * You should not disable this except for debugging purposes.
	 */
	ssl?: boolean;

	/**
	 * Custom hostname for connecting to chat.
	 */
	hostName?: string;

	/**
	 * Whether to use a WebSocket to connect to chat.
	 */
	webSocket?: boolean;

	/**
	 * The connection options for a WebSocket connection.
	 *
	 * If not using WebSockets, this is ignored.
	 */
	connectionOptions?: WebSocketConnectionOptions;

	/**
	 * Whether to receive JOIN and PART messages from Twitch chat.
	 */
	requestMembershipEvents?: boolean;

	/**
	 * Channels to join after connecting.
	 *
	 * May also be a function (sync or async) that returns a list of channels.
	 */
	channels?: ResolvableValue<string[]>;

	/**
	 * Whether you're guaranteed to be a mod in all joined channels.
	 *
	 * This raises the rate limit and lifts the one-second-between-messages rule,
	 * but if your bot is not a mod in one of the channels, it subjects you to messages
	 * possibly silently not being delivered and your bot possibly getting banned.
	 */
	isAlwaysMod?: boolean;

	/**
	 * Your bot level, i.e. whether you're a known or verified bot.
	 *
	 * This defaults to 'none', which limits your messages to the standard rate limit.
	 */
	botLevel?: TwitchBotLevel;

	/**
	 * The intents to use to query the auth provider.
	 *
	 * The "chat" intent will always be queried last, after the ones you give here.
	 */
	authIntents?: string[];
}

/** @private */
export interface ChatMessageRequest {
	type: 'say' | 'action';
	channel: string;
	text: string;
	tags?: Record<string, string>;
}

/** @private */
export interface WhisperRequest {
	target: string;
	text: string;
}

/**
 * An interface to Twitch chat.
 */
@rtfm('chat', 'ChatClient')
export class ChatClient extends EventEmitter {
	/** @private */
	@Enumerable(false) readonly _authProvider?: AuthProvider;

	private readonly _useLegacyScopes: boolean;
	private readonly _readOnly: boolean;
	private readonly _authIntents: string[];

	private _authToken?: AccessToken | null;
	private _authVerified = false;
	private _authRetryTimer?: Iterator<number, never>;
	private _authRetryCount = 0;

	private readonly _chatLogger: Logger;

	private readonly _messageRateLimiter: RateLimiter<ChatMessageRequest, void>;
	private readonly _joinRateLimiter: RateLimiter<string, void>;

	private readonly _ircClient: IrcClient;

	/**
	 * Fires when a user is timed out from a channel.
	 *
	 * @eventListener
	 * @param channel The channel the user is timed out from.
	 * @param user The timed out user.
	 * @param duration The duration of the timeout, in seconds.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onTimeout: EventBinder<[channel: string, user: string, duration: number, msg: ClearChat]> =
		this.registerEvent();

	/**
	 * Fires when a user is permanently banned from a channel.
	 *
	 * @eventListener
	 * @param channel The channel the user is banned from.
	 * @param user The banned user.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onBan: EventBinder<[channel: string, user: string, msg: ClearChat]> = this.registerEvent();

	/**
	 * Fires when a user upgrades their bits badge in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the bits badge was upgraded.
	 * @param user The user that has upgraded their bits badge.
	 * @param ritualInfo Additional information about the upgrade.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onBitsBadgeUpgrade: EventBinder<
		[channel: string, user: string, upgradeInfo: ChatBitsBadgeUpgradeInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when the chat of a channel is cleared.
	 *
	 * @eventListener
	 * @param channel The channel whose chat is cleared.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onChatClear: EventBinder<[channel: string, msg: ClearChat]> = this.registerEvent();

	/**
	 * Fires when emote-only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where emote-only mode is being toggled.
	 * @param enabled Whether emote-only mode is being enabled. If false, it's being disabled.
	 */
	readonly onEmoteOnly: EventBinder<[channel: string, enabled: boolean]> = this.registerEvent();

	/**
	 * Fires when followers-only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where followers-only mode is being toggled.
	 * @param enabled Whether followers-only mode is being enabled. If false, it's being disabled.
	 * @param delay The time (in minutes) a user needs to follow the channel to be able to talk. Only available when `enabled === true`.
	 */
	readonly onFollowersOnly: EventBinder<[channel: string, enabled: boolean, delay?: number]> = this.registerEvent();

	/**
	 * Fires when a user joins a channel.
	 *
	 * The join/part events are cached by the Twitch chat server and will be batched and sent every 30-60 seconds.
	 *
	 * Please note that unless you enabled the `requestMembershipEvents` option, this will only react to your own joins.
	 *
	 * @eventListener
	 * @param channel The channel that is being joined.
	 * @param user The user that joined.
	 */
	readonly onJoin: EventBinder<[channel: string, user: string]> = this.registerEvent();

	/**
	 * Fires when you fail to join a channel.
	 *
	 * @eventListener
	 * @param channel The channel that you tried to join.
	 * @param reason The reason for the failure.
	 */
	readonly onJoinFailure: EventBinder<[channel: string, reason: string]> = this.registerEvent();

	/**
	 * Fires when a user leaves ("parts") a channel.
	 *
	 * The join/part events are cached by the Twitch chat server and will be batched and sent every 30-60 seconds.
	 *
	 * Please note that unless you enabled the `requestMembershipEvents` option, this will only react to your own parts.
	 *
	 * @eventListener
	 * @param channel The channel that is being left.
	 * @param user The user that left.
	 */
	readonly onPart: EventBinder<[channel: string, user: string]> = this.registerEvent();

	/**
	 * Fires when a single message is removed from a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the message was removed.
	 * @param messageId The ID of the message that was removed.
	 * @param msg The full message object containing all message and user information.
	 *
	 * This is *not* the message that was removed. The text of the message is available using `msg.params.message` though.
	 */
	readonly onMessageRemove: EventBinder<[channel: string, messageId: string, msg: ClearMsg]> = this.registerEvent();

	/**
	 * Fires when R9K mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where R9K mode is being toggled.
	 * @param enabled Whether R9K mode is being enabled. If false, it's being disabled.
	 */
	readonly onR9k: EventBinder<[channel: string, enabled: boolean]> = this.registerEvent();

	/**
	 * Fires when a user raids a channel.
	 *
	 * @eventListener
	 * @param channel The channel that was raided.
	 * @param user The user that has raided the channel.
	 * @param raidInfo Additional information about the raid.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onRaid: EventBinder<[channel: string, user: string, raidInfo: ChatRaidInfo, msg: UserNotice]> =
		this.registerEvent();

	/**
	 * Fires when a user cancels a raid.
	 *
	 * @eventListener
	 * @param channel The channel where the raid was cancelled.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onRaidCancel: EventBinder<[channel: string, msg: UserNotice]> = this.registerEvent();

	/**
	 * Fires when a user performs a "ritual" in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the ritual was performed.
	 * @param user The user that has performed the ritual.
	 * @param ritualInfo Additional information about the ritual.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onRitual: EventBinder<[channel: string, user: string, ritualInfo: ChatRitualInfo, msg: UserNotice]> =
		this.registerEvent();

	/**
	 * Fires when slow mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where slow mode is being toggled.
	 * @param enabled Whether slow mode is being enabled. If false, it's being disabled.
	 * @param delay The time (in seconds) a user has to wait between sending messages. Only set when enabling slow mode.
	 */
	readonly onSlow: EventBinder<[channel: string, enabled: boolean, delay?: number]> = this.registerEvent();

	/**
	 * Fires when sub only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where sub only mode is being toggled.
	 * @param enabled Whether sub only mode is being enabled. If false, it's being disabled.
	 */
	readonly onSubsOnly: EventBinder<[channel: string, enabled: boolean]> = this.registerEvent();

	/**
	 * Fires when a user subscribes to a channel.
	 *
	 * @eventListener
	 * @param channel The channel that was subscribed to.
	 * @param user The subscribing user.
	 * @param subInfo Additional information about the subscription.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onSub: EventBinder<[channel: string, user: string, subInfo: ChatSubInfo, msg: UserNotice]> =
		this.registerEvent();

	/**
	 * Fires when a user resubscribes to a channel.
	 *
	 * @eventListener
	 * @param channel The channel that was resubscribed to.
	 * @param user The resubscribing user.
	 * @param subInfo Additional information about the resubscription.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onResub: EventBinder<[channel: string, user: string, subInfo: ChatSubInfo, msg: UserNotice]> =
		this.registerEvent();

	/**
	 * Fires when a user gifts a subscription to a channel to another user.
	 *
	 * Community subs also fire multiple `onSubGift` events.
	 * To prevent alert spam, check [Sub gift spam](/docs/examples/chat/sub-gift-spam).
	 *
	 * @eventListener
	 * @param channel The channel that was subscribed to.
	 * @param user The user that the subscription was gifted to. The gifting user is defined in `subInfo.gifter`.
	 * @param subInfo Additional information about the subscription.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onSubGift: EventBinder<[channel: string, user: string, subInfo: ChatSubGiftInfo, msg: UserNotice]> =
		this.registerEvent();

	/**
	 * Fires when a user gifts random subscriptions to the community of a channel.
	 *
	 * Community subs also fire multiple `onSubGift` events.
	 * To prevent alert spam, check [Sub gift spam](/docs/examples/chat/sub-gift-spam).
	 *
	 * @eventListener
	 * @param channel The channel that was subscribed to.
	 * @param user The gifting user.
	 * @param subInfo Additional information about the community subscription.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onCommunitySub: EventBinder<
		[channel: string, user: string, subInfo: ChatCommunitySubInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when a user extends their subscription using a Sub Token.
	 *
	 * @eventListener
	 * @param channel The channel where the subscription was extended.
	 * @param user The user that extended their subscription.
	 * @param subInfo Additional information about the subscription extension.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onSubExtend: EventBinder<[channel: string, user: string, subInfo: ChatSubExtendInfo, msg: UserNotice]> =
		this.registerEvent();

	/**
	 * Fires when a user gifts rewards during a special event.
	 *
	 * @eventListener
	 * @param channel The channel where the rewards were gifted.
	 * @param user The user that gifted the rewards.
	 * @param rewardGiftInfo Additional information about the reward gift.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onRewardGift: EventBinder<
		[channel: string, user: string, rewardGiftInfo: ChatRewardGiftInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when a user upgrades their Prime subscription to a paid subscription in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the subscription was upgraded.
	 * @param user The user that upgraded their subscription.
	 * @param subInfo Additional information about the subscription upgrade.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onPrimePaidUpgrade: EventBinder<
		[channel: string, user: string, subInfo: ChatSubUpgradeInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when a user upgrades their gift subscription to a paid subscription in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the subscription was upgraded.
	 * @param user The user that upgraded their subscription.
	 * @param subInfo Additional information about the subscription upgrade.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onGiftPaidUpgrade: EventBinder<
		[channel: string, user: string, subInfo: ChatSubGiftUpgradeInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when a user gifts a Twitch Prime benefit to the channel.
	 *
	 * @eventListener
	 * @param channel The channel where the benefit was gifted.
	 * @param user The user that received the gift.
	 *
	 * **WARNING:** This is a *display name* and thus will not work as an identifier for the API (login) in some cases.
	 * @param subInfo Additional information about the gift.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onPrimeCommunityGift: EventBinder<
		[channel: string, user: string, subInfo: ChatPrimeCommunityGiftInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when a user pays forward a subscription that was gifted to them to a specific user.
	 *
	 * @eventListener
	 * @param channel The channel where the gift was forwarded.
	 * @param user The user that forwarded the gift.
	 * @param forwardInfo Additional information about the gift.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onStandardPayForward: EventBinder<
		[channel: string, user: string, forwardInfo: ChatStandardPayForwardInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when a user pays forward a subscription that was gifted to them to the community.
	 *
	 * @eventListener
	 * @param channel The channel where the gift was forwarded.
	 * @param user The user that forwarded the gift.
	 * @param forwardInfo Additional information about the gift.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onCommunityPayForward: EventBinder<
		[channel: string, user: string, forwardInfo: ChatCommunityPayForwardInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when a user sends an announcement (/announce) to a channel.
	 *
	 * @eventListener
	 * @param channel The channel the announcement was sent to.
	 * @param user The user that sent the announcement.
	 * @param announcementInfo Additional information about the announcement.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onAnnouncement: EventBinder<
		[channel: string, user: string, announcementInfo: ChatAnnouncementInfo, msg: UserNotice]
	> = this.registerEvent();

	/**
	 * Fires when receiving a whisper from another user.
	 *
	 * @eventListener
	 * @param user The user that sent the whisper.
	 * @param text The message text.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onWhisper: EventBinder<[user: string, text: string, msg: Whisper]> = this.registerEvent();

	/**
	 * Fires when you tried to execute a command you don't have sufficient permission for.
	 *
	 * @eventListener
	 * @param channel The channel that a command without sufficient permissions was executed on.
	 * @param text The message text.
	 */
	readonly onNoPermission: EventBinder<[channel: string, text: string]> = this.registerEvent();

	/**
	 * Fires when a message you tried to send gets rejected by the ratelimiter.
	 *
	 * @eventListener
	 * @param channel The channel that was attempted to send to.
	 * @param text The message text.
	 */
	readonly onMessageRatelimit: EventBinder<[channel: string, text: string]> = this.registerEvent();

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
	readonly onAuthenticationFailure: EventBinder<[text: string, retryCount: number]> = this.registerEvent();

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
	readonly onMessageFailed: EventBinder<[channel: string, reason: string]> = this.registerEvent();

	/**
	 * Fires when a user sends a message to a channel.
	 *
	 * @eventListener
	 * @param channel The channel the message was sent to.
	 * @param user The user that sent the message.
	 * @param text The message text.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onMessage: EventBinder<[channel: string, user: string, text: string, msg: TwitchPrivateMessage]> =
		this.registerEvent();

	/**
	 * Fires when a user sends an action (/me) to a channel.
	 *
	 * @eventListener
	 * @param channel The channel the action was sent to.
	 * @param user The user that sent the action.
	 * @param text The action text.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onAction: EventBinder<[channel: string, user: string, text: string, msg: TwitchPrivateMessage]> =
		this.registerEvent();

	// internal events to resolve promises and stuff
	private readonly _onJoinResult: EventBinder<[channel: string, state?: Map<string, string>, error?: string]> =
		this.registerInternalEvent();

	/**
	 * Creates a new Twitch chat client.
	 *
	 * @expandParams
	 *
	 * @param config
	 */
	constructor(config: ChatClientOptions = {}) {
		if (config.authProvider && !config.authProvider.getAccessTokenForIntent) {
			throw new InvalidTokenTypeError(
				'You can not connect to chat using an AuthProvider that does not support intents.\n' +
					"To get an anonymous, read-only connection, please don't pass an `AuthProvider` at all.\n" +
					'To get a read-write connection, please provide an auth provider that provides user access tokens via intents, such as `RefreshingAuthProvider`.'
			);
		}

		super();

		this._ircClient = new IrcClient({
			connection: {
				hostName:
					config.hostName ?? (config.webSocket ?? true ? 'irc-ws.chat.twitch.tv' : 'irc.chat.twitch.tv'),
				secure: config.ssl ?? true
			},
			credentials: {
				nick: '',
				password: async () => await this._getAuthToken()
			},
			webSocket: config.webSocket ?? true,
			connectionOptions: config.connectionOptions,
			logger: {
				name: 'twurple:chat:irc',
				...config.logger
			},
			nonConformingCommands: ['004'],
			manuallyAcknowledgeJoins: true
		});

		this._ircClient.onDisconnect(() => {
			this._messageRateLimiter.clear();
			this._messageRateLimiter.pause();
			this._joinRateLimiter.clear();
			this._joinRateLimiter.pause();
		});

		this._ircClient.registerMessageType(TwitchPrivateMessage);

		this._chatLogger = createLogger({
			name: 'twurple:chat:twitch',
			...config.logger
		});

		this._authProvider = config.authProvider;

		this._useLegacyScopes = !!config.legacyScopes;
		this._readOnly = !!config.readOnly;
		this._authIntents = [...(config.authIntents ?? []), 'chat'];

		const executeChatMessageRequest = async ({ type, text, channel, tags }: ChatMessageRequest) => {
			if (type === 'say') {
				this._ircClient.say(channel, text, tags);
			} else {
				this._ircClient.action(channel, text);
			}
		};

		const executeJoinRequest = async (channel: string) =>
			await new Promise<void>((resolve, reject) => {
				// eslint-disable-next-line @typescript-eslint/init-declarations
				let timer: NodeJS.Timer;
				const e = this.addInternalListener(this._onJoinResult, (chan, state, error) => {
					if (chan === channel) {
						clearTimeout(timer);
						if (error) {
							reject(error);
						} else {
							resolve();
						}
						this.removeListener(e);
					}
				});
				timer = setTimeout(() => {
					this.removeListener(e);
					this.emit(this._onJoinResult, channel, undefined, 'twurple_timeout');
					reject(
						new Error(`Did not receive a reply to join ${channel} in time; assuming that the join failed`)
					);
				}, 10000);
				this._ircClient.join(channel);
			});

		if (config.isAlwaysMod) {
			this._messageRateLimiter = new TimeBasedRateLimiter({
				bucketSize: config.botLevel === 'verified' ? 7500 : 100,
				timeFrame: 32000,
				doRequest: executeChatMessageRequest
			});
		} else {
			let bucketSize = 20;
			if (config.botLevel === 'verified') {
				bucketSize = 7500;
			} else if (config.botLevel === 'known') {
				bucketSize = 50;
			}
			this._messageRateLimiter = new TimedPassthruRateLimiter(
				new PartitionedTimeBasedRateLimiter({
					bucketSize: 1,
					timeFrame: 1200,
					logger: { minLevel: LogLevel.ERROR },
					doRequest: executeChatMessageRequest,
					getPartitionKey: ({ channel }) => channel
				}),
				{ bucketSize, timeFrame: 32000 }
			);
		}
		this._joinRateLimiter = new TimeBasedRateLimiter({
			bucketSize: config.botLevel === 'verified' ? 2000 : 20,
			timeFrame: 11000,
			doRequest: executeJoinRequest
		});

		this._messageRateLimiter.pause();
		this._joinRateLimiter.pause();

		this._ircClient.addCapability(TwitchTagsCapability);
		this._ircClient.addCapability(TwitchCommandsCapability);
		if (config.requestMembershipEvents) {
			this._ircClient.addCapability(TwitchMembershipCapability);
		}

		this._ircClient.onRegister(async () => {
			this.emit(this.onAuthenticationSuccess);
			this._messageRateLimiter.resume();
			this._joinRateLimiter.resume();
			this._authVerified = true;
			this._authRetryTimer = undefined;
			this._authRetryCount = 0;

			const resolvedChannels = await resolveConfigValue(config.channels);
			if (resolvedChannels) {
				await Promise.all(
					resolvedChannels.map(async channel => {
						try {
							await this.join(channel);
						} catch (e) {
							this._chatLogger.warn(
								// TODO this error should always throw an Error instance,
								//  currently it sometimes rejects with a string
								`Failed to join configured channel ${channel}; original message: ${
									(e as Error | null)?.message ?? (e as string)
								}`
							);
						}
					})
				);
			}
		});

		this._ircClient.onPasswordError(e => {
			this._chatLogger.error(`Error fetching a token for connecting to the server: ${e.message}`);
			this.emit(this.onTokenFetchFailure, e);
		});

		this._ircClient.onPrivmsg((channel, user, text, msg) => {
			if (user !== 'jtv') {
				this.emit(this.onMessage, channel, user, text, msg);
			}
		});

		this._ircClient.onAction((channel, user, text, msg) => {
			this.emit(this.onAction, channel, user, text, msg);
		});

		this.addInternalListener(this._onJoinResult, (channel, _, error) => {
			if (error) {
				this.emit(this.onJoinFailure, channel, error);
			} else {
				this._ircClient.acknowledgeJoin(channel);
			}
		});

		this._ircClient.onTypedMessage(ClearChat, msg => {
			const {
				params: { channel, user },
				tags
			} = msg;
			if (user) {
				const duration = tags.get('ban-duration');
				if (duration === undefined) {
					// ban
					this.emit(this.onBan, channel, user, msg);
				} else {
					// timeout
					this.emit(this.onTimeout, channel, user, Number(duration), msg);
				}
			} else {
				// full chat clear
				this.emit(this.onChatClear, channel, msg);
			}
		});

		this._ircClient.onTypedMessage(ClearMsg, msg => {
			const {
				params: { channel },
				targetMessageId
			} = msg;
			this.emit(this.onMessageRemove, channel, targetMessageId, msg);
		});

		this._ircClient.onTypedMessage(MessageTypes.Commands.ChannelJoin, ({ prefix, params: { channel } }) => {
			this.emit(this.onJoin, channel, prefix!.nick);
		});

		this._ircClient.onTypedMessage(MessageTypes.Commands.ChannelPart, ({ prefix, params: { channel } }) => {
			this.emit(this.onPart, channel, prefix!.nick);
		});

		this._ircClient.onTypedMessage(RoomState, ({ params: { channel }, tags }) => {
			let isInitial = false;
			if (tags.has('subs-only') && tags.has('slow')) {
				// this is the full state - so we just successfully joined
				this.emit(this._onJoinResult, channel, tags);
				isInitial = true;
			}

			if (!isInitial) {
				if (tags.has('slow')) {
					const slowDelay = Number(tags.get('slow'));
					if (slowDelay) {
						this.emit(this.onSlow, channel, true, slowDelay);
					} else {
						this.emit(this.onSlow, channel, false);
					}
				}

				if (tags.has('followers-only')) {
					const followDelay = Number(tags.get('followers-only'));
					if (followDelay === -1) {
						this.emit(this.onFollowersOnly, channel, false);
					} else {
						this.emit(this.onFollowersOnly, channel, true, followDelay);
					}
				}
			}
		});

		this._ircClient.onTypedMessage(UserNotice, userNotice => {
			const {
				params: { channel, message },
				tags
			} = userNotice;
			const messageType = tags.get('msg-id')!;

			switch (messageType) {
				case 'sub':
				case 'resub': {
					const event = messageType === 'sub' ? this.onSub : this.onResub;
					const plan = tags.get('msg-param-sub-plan')!;
					const streakMonths = tags.get('msg-param-streak-months');
					const subInfo: ChatSubInfo = {
						userId: tags.get('user-id')!,
						displayName: tags.get('display-name')!,
						plan,
						planName: tags.get('msg-param-sub-plan-name')!,
						isPrime: plan === 'Prime',
						months: Number(tags.get('msg-param-cumulative-months')),
						streak: streakMonths ? Number(streakMonths) : undefined,
						message
					};
					const wasGifted = tags.get('msg-param-was-gifted') === 'true';
					if (wasGifted) {
						const wasAnonGift = tags.get('msg-param-anon-gift') === 'true';
						const duration = Number(tags.get('msg-param-gift-months'));
						const redeemedMonth = Number(tags.get('msg-param-gift-month-being-redeemed'));
						if (wasAnonGift) {
							subInfo.originalGiftInfo = {
								anonymous: true,
								duration,
								redeemedMonth
							};
						} else {
							subInfo.originalGiftInfo = {
								anonymous: false,
								duration,
								redeemedMonth,
								userId: tags.get('msg-param-gifter-id')!,
								userName: tags.get('msg-param-gifter-login')!,
								userDisplayName: tags.get('msg-param-gifter-name')!
							};
						}
					}
					this.emit(event, channel, tags.get('login')!, subInfo, userNotice);
					break;
				}
				case 'subgift': {
					const plan = tags.get('msg-param-sub-plan')!;
					const gifter = tags.get('login');
					const isAnon = gifter === 'ananonymousgifter';
					const subInfo: ChatSubGiftInfo = {
						userId: tags.get('msg-param-recipient-id')!,
						displayName: tags.get('msg-param-recipient-display-name')!,
						gifter: isAnon ? undefined : gifter,
						gifterUserId: isAnon ? undefined : tags.get('user-id')!,
						gifterDisplayName: isAnon ? undefined : tags.get('display-name')!,
						gifterGiftCount: isAnon ? undefined : Number(tags.get('msg-param-sender-count')),
						giftDuration: Number(tags.get('msg-param-gift-months')),
						plan,
						planName: tags.get('msg-param-sub-plan-name')!,
						isPrime: plan === 'Prime',
						months: Number(tags.get('msg-param-months'))
					};
					this.emit(this.onSubGift, channel, tags.get('msg-param-recipient-user-name')!, subInfo, userNotice);
					break;
				}
				case 'submysterygift': {
					const gifter = tags.get('login');
					const isAnon = gifter === 'ananonymousgifter';
					const communitySubInfo: ChatCommunitySubInfo = {
						gifter: isAnon ? undefined : gifter,
						gifterUserId: isAnon ? undefined : tags.get('user-id')!,
						gifterDisplayName: isAnon ? undefined : tags.get('display-name')!,
						gifterGiftCount: isAnon ? undefined : Number(tags.get('msg-param-sender-count')),
						count: Number(tags.get('msg-param-mass-gift-count')!),
						plan: tags.get('msg-param-sub-plan')!
					};
					this.emit(this.onCommunitySub, channel, tags.get('login')!, communitySubInfo, userNotice);
					break;
				}
				case 'primepaidupgrade': {
					const upgradeInfo: ChatSubUpgradeInfo = {
						userId: tags.get('user-id')!,
						displayName: tags.get('display-name')!,
						plan: tags.get('msg-param-sub-plan')!
					};
					this.emit(this.onPrimePaidUpgrade, channel, tags.get('login')!, upgradeInfo, userNotice);
					break;
				}
				case 'giftpaidupgrade': {
					const upgradeInfo: ChatSubGiftUpgradeInfo = {
						userId: tags.get('user-id')!,
						displayName: tags.get('display-name')!,
						gifter: tags.get('msg-param-sender-login')!,
						gifterDisplayName: tags.get('msg-param-sender-name')!
					};
					this.emit(this.onGiftPaidUpgrade, channel, tags.get('login')!, upgradeInfo, userNotice);
					break;
				}
				case 'standardpayforward': {
					const wasAnon = tags.get('msg-param-prior-gifter-anonymous') === 'true';
					const forwardInfo: ChatStandardPayForwardInfo = {
						userId: tags.get('user-id')!,
						displayName: tags.get('display-name')!,
						originalGifterUserId: wasAnon ? undefined : tags.get('msg-param-prior-gifter-id')!,
						originalGifterDisplayName: wasAnon
							? undefined
							: tags.get('msg-param-prior-gifter-display-name')!,
						recipientUserId: tags.get('msg-param-recipient-id')!,
						recipientDisplayName: tags.get('msg-param-recipient-display-name')!
					};
					this.emit(this.onStandardPayForward, channel, tags.get('login')!, forwardInfo, userNotice);
					break;
				}
				case 'communitypayforward': {
					const wasAnon = tags.get('msg-param-prior-gifter-anonymous') === 'true';
					const forwardInfo: ChatCommunityPayForwardInfo = {
						userId: tags.get('user-id')!,
						displayName: tags.get('display-name')!,
						originalGifterUserId: wasAnon ? undefined : tags.get('msg-param-prior-gifter-id')!,
						originalGifterDisplayName: wasAnon
							? undefined
							: tags.get('msg-param-prior-gifter-display-name')!
					};
					this.emit(this.onCommunityPayForward, channel, tags.get('login')!, forwardInfo, userNotice);
					break;
				}
				case 'primecommunitygiftreceived': {
					const giftInfo: ChatPrimeCommunityGiftInfo = {
						name: tags.get('msg-param-gift-name')!,
						gifter: tags.get('login')!,
						gifterDisplayName: tags.get('display-name')!
					};
					this.emit(
						this.onPrimeCommunityGift,
						channel,
						tags.get('msg-param-recipient')!,
						giftInfo,
						userNotice
					);
					break;
				}
				case 'raid': {
					const raidInfo: ChatRaidInfo = {
						displayName: tags.get('msg-param-displayName')!,
						viewerCount: Number(tags.get('msg-param-viewerCount'))
					};
					this.emit(this.onRaid, channel, tags.get('login')!, raidInfo, userNotice);
					break;
				}
				case 'unraid': {
					this.emit(this.onRaidCancel, channel, userNotice);
					break;
				}
				case 'ritual': {
					const ritualInfo: ChatRitualInfo = {
						ritualName: tags.get('msg-param-ritual-name')!,
						message
					};
					this.emit(this.onRitual, channel, tags.get('login')!, ritualInfo, userNotice);
					break;
				}
				case 'bitsbadgetier': {
					const badgeUpgradeInfo: ChatBitsBadgeUpgradeInfo = {
						displayName: tags.get('display-name')!,
						threshold: Number(tags.get('msg-param-threshold'))
					};
					this.emit(this.onBitsBadgeUpgrade, channel, tags.get('login')!, badgeUpgradeInfo, userNotice);
					break;
				}
				case 'extendsub': {
					const extendInfo: ChatSubExtendInfo = {
						userId: tags.get('user-id')!,
						displayName: tags.get('display-name')!,
						plan: tags.get('msg-param-sub-plan')!,
						months: Number(tags.get('msg-param-cumulative-months')),
						endMonth: Number(tags.get('msg-param-sub-benefit-end-month'))
					};
					this.emit(this.onSubExtend, channel, tags.get('login')!, extendInfo, userNotice);
					break;
				}
				case 'rewardgift': {
					const rewardGiftInfo: ChatRewardGiftInfo = {
						domain: tags.get('msg-param-domain')!,
						gifterId: tags.get('user-id')!,
						gifterDisplayName: tags.get('display-name')!,
						count: Number(tags.get('msg-param-selected-count')),
						gifterGiftCount: Number(tags.get('msg-param-total-reward-count')),
						triggerType: tags.get('msg-param-trigger-type')!
					};
					this.emit(this.onRewardGift, channel, tags.get('login')!, rewardGiftInfo, userNotice);
					break;
				}
				case 'announcement': {
					const announcementInfo: ChatAnnouncementInfo = {
						color: tags.get('msg-param-color')!
					};
					this.emit(this.onAnnouncement, channel, tags.get('login')!, announcementInfo, userNotice);
					break;
				}
				default: {
					this._chatLogger.warn(`Unrecognized usernotice ID: ${messageType}`);
				}
			}
		});

		this._ircClient.onTypedMessage(Whisper, whisper => {
			this.emit(this.onWhisper, whisper.prefix!.nick, whisper.params.message, whisper);
		});

		this._ircClient.onTypedMessage(
			MessageTypes.Commands.Notice,
			async ({ params: { target: channel, content }, tags }) => {
				const messageType = tags.get('msg-id');

				switch (messageType) {
					// emote only
					case 'emote_only_on': {
						this.emit(this.onEmoteOnly, channel, true);
						break;
					}

					case 'emote_only_off': {
						this.emit(this.onEmoteOnly, channel, false);
						break;
					}

					// join (success is handled when ROOMSTATE comes in)
					case 'msg_channel_suspended':
					case 'msg_banned': {
						this.emit(this._onJoinResult, channel, undefined, messageType);
						break;
					}

					// r9k
					case 'r9k_on': {
						this.emit(this.onR9k, channel, true);
						break;
					}

					case 'r9k_off': {
						this.emit(this.onR9k, channel, false);
						break;
					}

					// subs only
					case 'subs_on': {
						this.emit(this.onSubsOnly, channel, true);
						break;
					}

					case 'subs_off': {
						this.emit(this.onSubsOnly, channel, false);
						break;
					}

					case 'cmds_available': {
						// do we really care?
						break;
					}

					// there's other messages that show us the following things...
					// ...like ROOMSTATE...
					case 'followers_on':
					case 'followers_on_zero':
					case 'followers_off':
					case 'slow_on':
					case 'slow_off': {
						break;
					}

					// ...and CLEARCHAT...
					case 'timeout_success': {
						break;
					}

					case 'unrecognized_cmd': {
						break;
					}

					case 'no_permission': {
						this.emit(this.onNoPermission, channel, content);
						break;
					}

					case 'msg_ratelimit': {
						this.emit(this.onMessageRatelimit, channel, content);
						break;
					}

					case 'msg_duplicate':
					case 'msg_emoteonly':
					case 'msg_followersonly':
					case 'msg_followersonly_followed':
					case 'msg_followersonly_zero':
					case 'msg_subsonly':
					case 'msg_slowmode':
					case 'msg_r9k':
					case 'msg_verified_email':
					case 'msg_timedout':
					case 'msg_rejected_mandatory':
					case 'msg_channel_blocked': {
						this.emit(this.onMessageFailed, channel, messageType);
						break;
					}

					case undefined: {
						// this might be one of these weird authentication error notices that don't have a msg-id...
						if (
							content === 'Login authentication failed' ||
							content === 'Improperly formatted AUTH' ||
							content === 'Invalid NICK'
						) {
							this._authVerified = false;
							if (!this._authRetryTimer) {
								this._authRetryTimer = fibWithLimit(120);
								this._authRetryCount = 0;
							}
							const secs = this._authRetryTimer.next().value;
							const authRetries = ++this._authRetryCount;
							this.emit(this.onAuthenticationFailure, content, authRetries);
							if (secs !== 0) {
								this._chatLogger.info(`Retrying authentication in ${secs} seconds`);
							}
							await delay(secs * 1000);
							this._ircClient.reconnect();
						}
						break;
					}

					default: {
						if (!messageType.startsWith('usage_')) {
							this._chatLogger.warn(`Unrecognized notice ID: '${messageType}'`);
						}
					}
				}
			}
		);
	}

	/**
	 * Connects to the chat server.
	 *
	 * This method doesn't actually do anything async, so you can ignore the promise it returns.
	 */
	async connect(): Promise<void> {
		if (!this._authProvider) {
			this._ircClient.changeNick(ChatClient._generateJustinfanNick());
		}

		this._ircClient.connect();
	}

	/**
	 * The underlying IRC client. Use sparingly.
	 */
	get irc(): IrcClient {
		return this._ircClient;
	}

	/**
	 * The channels the client is currently in.
	 */
	get currentChannels(): string[] {
		return this._ircClient.currentChannels;
	}

	/**
	 * Sends a message to a channel.
	 *
	 * @param channel The channel to send the message to.
	 * @param text The message to send.
	 * @param attributes The attributes to add to the message.
	 * @param rateLimiterOptions Options to pass to the rate limiter.
	 */
	async say(
		channel: string,
		text: string,
		attributes: ChatSayMessageAttributes = {},
		rateLimiterOptions?: RateLimiterRequestOptions
	): Promise<void> {
		const tags: Record<string, string> = {};
		if (attributes.replyTo) {
			tags['reply-parent-msg-id'] = extractMessageId(attributes.replyTo);
		}

		const texts = splitOnSpaces(text, 500);
		await Promise.all(
			texts.map(
				async msg =>
					await this._messageRateLimiter.request(
						{
							type: 'say',
							channel: toChannelName(channel),
							text: msg,
							tags
						},
						rateLimiterOptions
					)
			)
		);
	}

	/**
	 * Sends an action message (/me) to a channel.
	 *
	 * @param channel The channel to send the message to.
	 * @param text The message to send.
	 * @param rateLimiterOptions Options to pass to the rate limiter.
	 */
	async action(channel: string, text: string, rateLimiterOptions?: RateLimiterRequestOptions): Promise<void> {
		const texts = splitOnSpaces(text, 490);
		await Promise.all(
			texts.map(
				async msg =>
					await this._messageRateLimiter.request(
						{
							type: 'action',
							channel: toChannelName(channel),
							text: msg
						},
						rateLimiterOptions
					)
			)
		);
	}

	/**
	 * Joins a channel.
	 *
	 * @param channel The channel to join.
	 */
	async join(channel: string): Promise<void> {
		await this._joinRateLimiter.request(toChannelName(channel));
	}

	/**
	 * Leaves a channel ("part" in IRC terms).
	 *
	 * @param channel The channel to leave.
	 */
	part(channel: string): void {
		this._ircClient.part(toChannelName(channel));
	}

	/**
	 * Disconnects from the chat server.
	 */
	quit(): void {
		this._ircClient.quitAbruptly();
	}

	/**
	 * Reconnects to the chat server.
	 *
	 * This method doesn't actually do anything async, so you can ignore the promise it returns.
	 */
	async reconnect(): Promise<void> {
		this.quit();
		await this.connect();
	}

	private async _getAuthToken(): Promise<string | undefined> {
		if (!this._authProvider) {
			this._chatLogger.debug('No authProvider given; connecting anonymously');
			return undefined;
		}

		if (this._authToken && !accessTokenIsExpired(this._authToken) && this._authVerified) {
			this._chatLogger.debug('AccessToken assumed to be correct from last connection');
			return `oauth:${this._authToken.accessToken}`;
		}

		const scopes = this._getNecessaryScopes();
		let lastTokenError: InvalidTokenError | undefined = undefined;
		let foundSomeIntent = false;

		for (const intent of this._authIntents) {
			try {
				this._authToken = await this._authProvider.getAccessTokenForIntent!(intent, scopes);
				if (!this._authToken) {
					continue;
				}
				foundSomeIntent = true;
				const token = await getTokenInfo(this._authToken.accessToken);
				if (!token.userName) {
					throw new InvalidTokenTypeError(
						'Could not determine a user name for your token; you might be trying to disguise an app token as a user token.'
					);
				}
				this._ircClient.changeNick(token.userName);
				return `oauth:${this._authToken.accessToken}`;
			} catch (e: unknown) {
				if (e instanceof InvalidTokenError) {
					lastTokenError = e;
				} else {
					this._chatLogger.error(`Retrieving an access token failed: ${(e as Error).message}`);
				}
			}

			this._chatLogger.warn('No valid token available; trying to refresh');

			try {
				this._authToken = await this._authProvider.refreshAccessTokenForIntent?.('chat');

				if (this._authToken) {
					const token = await getTokenInfo(this._authToken.accessToken);
					if (!token.userName) {
						throw new InvalidTokenTypeError(
							'Could not determine a user name for your token; you might be trying to disguise an app token as a user token.'
						);
					}
					this._ircClient.changeNick(token.userName);
					return `oauth:${this._authToken.accessToken}`;
				}
			} catch (e: unknown) {
				if (e instanceof InvalidTokenError) {
					lastTokenError = e;
				} else {
					this._chatLogger.error(`Refreshing the access token failed: ${(e as Error).message}`);
				}
			}
		}

		this._authVerified = false;
		throw (
			lastTokenError ??
			new Error(
				foundSomeIntent
					? 'Could not retrieve a valid token'
					: `None of the queried intents (${this._authIntents.join(', ')}) are known by the auth provider${
							this._authProvider instanceof RefreshingAuthProvider
								? '.\nPlease add one of these to the user you want to connect with using the ' +
								  '`addIntentToUser` method or the additional parameter to `addUser` or `addUserForToken`.'
								: ''
					  }`
			)
		);
	}

	private _getNecessaryScopes() {
		if (this._useLegacyScopes) {
			return ['chat_login'];
		}
		if (this._readOnly) {
			return ['chat:read'];
		}
		return ['chat:read', 'chat:edit'];
	}

	private static _generateJustinfanNick() {
		const randomSuffix = Math.floor(Math.random() * 100000)
			.toString()
			.padStart(5, '0');
		return `justinfan${randomSuffix}`;
	}
}
