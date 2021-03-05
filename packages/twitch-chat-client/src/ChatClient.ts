import type { LoggerOptions } from '@d-fischer/logger';
import { Logger, LogLevel } from '@d-fischer/logger';
import type { RateLimiter } from '@d-fischer/rate-limiter';
import {
	PartitionedTimeBasedRateLimiter,
	TimeBasedRateLimiter,
	TimedPassthruRateLimiter
} from '@d-fischer/rate-limiter';
import type { ResolvableValue } from '@d-fischer/shared-utils';
import { delay, Enumerable } from '@d-fischer/shared-utils';
import type { Listener } from '@d-fischer/typed-event-emitter';
import type { WebSocketConnectionOptions } from 'ircv3';
import { IrcClient, MessageTypes } from 'ircv3';
import type { AccessToken, AuthProvider } from 'twitch-auth';
import { getTokenInfo, InvalidTokenError, InvalidTokenTypeError } from 'twitch-auth';
import type { CommercialLength } from 'twitch-common';
import { rtfm } from 'twitch-common';
import { TwitchCommandsCapability } from './Capabilities/TwitchCommandsCapability';
import { ClearChat } from './Capabilities/TwitchCommandsCapability/MessageTypes/ClearChat';
import { HostTarget } from './Capabilities/TwitchCommandsCapability/MessageTypes/HostTarget';
import { RoomState } from './Capabilities/TwitchCommandsCapability/MessageTypes/RoomState';
import { UserNotice } from './Capabilities/TwitchCommandsCapability/MessageTypes/UserNotice';
import { Whisper } from './Capabilities/TwitchCommandsCapability/MessageTypes/Whisper';
import { TwitchMembershipCapability } from './Capabilities/TwitchMembershipCapability';
import { TwitchTagsCapability } from './Capabilities/TwitchTagsCapability';
import { ClearMsg } from './Capabilities/TwitchTagsCapability/MessageTypes/ClearMsg';
import type { ChatSayMessageAttributes } from './ChatMessageAttributes';
import { extractMessageId } from './ChatMessageAttributes';
import { TwitchPrivateMessage } from './StandardCommands/TwitchPrivateMessage';
import { toChannelName, toUserName } from './Toolkit/UserTools';
import type { ChatBitsBadgeUpgradeInfo } from './UserNotices/ChatBitsBadgeUpgradeInfo';
import type { ChatCommunityPayForwardInfo } from './UserNotices/ChatCommunityPayForwardInfo';
import type { ChatCommunitySubInfo } from './UserNotices/ChatCommunitySubInfo';
import type { ChatPrimeCommunityGiftInfo } from './UserNotices/ChatPrimeCommunityGiftInfo';
import type { ChatRaidInfo } from './UserNotices/ChatRaidInfo';
import type { ChatRewardGiftInfo } from './UserNotices/ChatRewardGiftInfo';
import type { ChatRitualInfo } from './UserNotices/ChatRitualInfo';
import type { ChatStandardPayForwardInfo } from './UserNotices/ChatStandardPayForwardInfo';
import type {
	ChatSubExtendInfo,
	ChatSubGiftInfo,
	ChatSubGiftUpgradeInfo,
	ChatSubInfo,
	ChatSubUpgradeInfo
} from './UserNotices/ChatSubInfo';

const GENERIC_CHANNEL = 'twjs';

/**
 * A Twitch bot level, i.e. whether you're connecting as a known or verified bot.
 */
export type TwitchBotLevel = 'none' | 'known' | 'verified';

/**
 * Options for a chat client.
 */
export interface BaseChatClientOptions {
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
	 * This raises the rate limit and lifts the one-second-between-messages rule, but subjects you to messages
	 * possibly silently not being delivered and your bot possibly getting banned
	 * if your bot is not a mod in one of the channels.
	 */
	isAlwaysMod?: boolean;

	/**
	 * Your bot level, i.e. whether you're a known or verified bot.
	 *
	 * This defaults to 'none', which limits your messages to the standard rate limit.
	 */
	botLevel?: TwitchBotLevel;
}

export interface WebSocketChatClientOptions extends BaseChatClientOptions {
	webSocket?: true;
	connectionOptions?: WebSocketConnectionOptions;
}

export interface TcpChatClientOptions extends BaseChatClientOptions {
	webSocket: false;
	connectionOptions?: never;
}

export type ChatClientOptions = WebSocketChatClientOptions | TcpChatClientOptions;

/** @private */
export interface ChatMessageRequest {
	type: 'say' | 'action';
	channel: string;
	message: string;
	tags?: Record<string, string>;
}

/** @private */
export interface WhisperRequest {
	target: string;
	message: string;
}

/**
 * An interface to Twitch chat.
 *
 * @inheritDoc
 * @hideProtected
 */
@rtfm('twitch-chat-client', 'ChatClient')
export class ChatClient extends IrcClient {
	private static readonly HOST_MESSAGE_REGEX = /(\w+) is now ((?:auto[- ])?)hosting you(?: for (?:up to )?(\d+))?/;

	/** @private */
	@Enumerable(false) readonly _authProvider?: AuthProvider;

	private readonly _useLegacyScopes: boolean;
	private readonly _readOnly: boolean;

	private _authToken?: AccessToken | null;
	private _authVerified = false;
	private _authRetryTimer?: Iterator<number, never>;

	private readonly _chatLogger: Logger;

	private readonly _messageRateLimiter: RateLimiter<ChatMessageRequest, void>;
	private readonly _joinRateLimiter: RateLimiter<string, void>;
	private readonly _whisperRateLimiter: RateLimiter<WhisperRequest, void>;

	private _needToShowWhisperWarning = false;

	/**
	 * Fires when a user is timed out from a channel.
	 *
	 * @eventListener
	 * @param channel The channel the user is timed out from.
	 * @param user The timed out user.
	 * @param duration The duration of the timeout, in seconds.
	 */
	readonly onTimeout: (
		handler: (channel: string, user: string, duration: number) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user is permanently banned from a channel.
	 *
	 * @eventListener
	 * @param channel The channel the user is banned from.
	 * @param user The banned user.
	 */
	readonly onBan: (handler: (channel: string, user: string) => void) => Listener = this.registerEvent();

	/**
	 * Fires when a user upgrades their bits badge in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the bits badge was upgraded.
	 * @param user The user that has upgraded their bits badge.
	 * @param ritualInfo Additional information about the upgrade.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onBitsBadgeUpgrade: (
		handler: (channel: string, user: string, upgradeInfo: ChatBitsBadgeUpgradeInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when the chat of a channel is cleared.
	 *
	 * @eventListener
	 * @param channel The channel whose chat is cleared.
	 */
	readonly onChatClear: (handler: (channel: string) => void) => Listener = this.registerEvent();

	/**
	 * Fires when emote-only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where emote-only mode is being toggled.
	 * @param enabled Whether emote-only mode is being enabled. If false, it's being disabled.
	 */
	readonly onEmoteOnly: (handler: (channel: string, enabled: boolean) => void) => Listener = this.registerEvent();

	/**
	 * Fires when followers-only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where followers-only mode is being toggled.
	 * @param enabled Whether followers-only mode is being enabled. If false, it's being disabled.
	 * @param delay The time (in minutes) a user needs to follow the channel to be able to talk. Only available when `enabled === true`.
	 */
	readonly onFollowersOnly: (
		handler: (channel: string, enabled: boolean, delay?: number) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a channel hosts another channel.
	 *
	 * @eventListener
	 * @param channel The hosting channel.
	 * @param target The channel that is being hosted.
	 * @param viewers The number of viewers in the hosting channel.
	 *
	 * If you're not logged in as the owner of the channel, this is undefined.
	 */
	readonly onHost: (
		handler: (channel: string, target: string, viewers?: number) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a channel you're logged in as its owner is being hosted by another channel.
	 *
	 * @eventListener
	 * @param channel The channel that is being hosted.
	 * @param byChannel The hosting channel.
	 * @param auto Whether the host was triggered automatically (by Twitch's auto-host functionality).
	 * @param viewers The number of viewers in the hosting channel.
	 */
	readonly onHosted: (
		handler: (channel: string, byChannel: string, auto: boolean, viewers?: number) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when Twitch tells you the number of hosts you have remaining in the next half hour for the channel
	 * for which you're logged in as owner after hosting a channel.
	 *
	 * @eventListener
	 * @param channel The hosting channel.
	 * @param numberOfHosts The number of hosts remaining in the next half hour.
	 */
	readonly onHostsRemaining: (
		handler: (channel: string, numberOfHosts: number) => void
	) => Listener = this.registerEvent();

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
	readonly onJoin: (handler: (channel: string, user: string) => void) => Listener = this.registerEvent();

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
	readonly onPart: (handler: (channel: string, user: string) => void) => Listener = this.registerEvent();

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
	readonly onMessageRemove: (
		handler: (channel: string, messageId: string, msg: ClearMsg) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when R9K mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where R9K mode is being toggled.
	 * @param enabled Whether R9K mode is being enabled. If false, it's being disabled.
	 */
	readonly onR9k: (handler: (channel: string, enabled: boolean) => void) => Listener = this.registerEvent();

	/**
	 * Fires when host mode is disabled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where host mode is being disabled.
	 */
	readonly onUnhost: (handler: (channel: string) => void) => Listener = this.registerEvent();

	/**
	 * Fires when a user raids a channel.
	 *
	 * @eventListener
	 * @param channel The channel that was raided.
	 * @param user The user that has raided the channel.
	 * @param raidInfo Additional information about the raid.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onRaid: (
		handler: (channel: string, user: string, raidInfo: ChatRaidInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user cancels a raid.
	 *
	 * @eventListener
	 * @param channel The channel where the raid was cancelled.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onRaidCancel: (handler: (channel: string, msg: UserNotice) => void) => Listener = this.registerEvent();

	/**
	 * Fires when a user performs a "ritual" in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the ritual was performed.
	 * @param user The user that has performed the ritual.
	 * @param ritualInfo Additional information about the ritual.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onRitual: (
		handler: (channel: string, user: string, ritualInfo: ChatRitualInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when slow mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where slow mode is being toggled.
	 * @param enabled Whether slow mode is being enabled. If false, it's being disabled.
	 * @param delay The time (in seconds) a user has to wait between sending messages. Only set when enabling slow mode.
	 */
	readonly onSlow: (
		handler: (channel: string, enabled: boolean, delay?: number) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when sub only mode is toggled in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where sub only mode is being toggled.
	 * @param enabled Whether sub only mode is being enabled. If false, it's being disabled.
	 */
	readonly onSubsOnly: (handler: (channel: string, enabled: boolean) => void) => Listener = this.registerEvent();

	/**
	 * Fires when a user subscribes to a channel.
	 *
	 * @eventListener
	 * @param channel The channel that was subscribed to.
	 * @param user The subscribing user.
	 * @param subInfo Additional information about the subscription.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onSub: (
		handler: (channel: string, user: string, subInfo: ChatSubInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user resubscribes to a channel.
	 *
	 * @eventListener
	 * @param channel The channel that was resubscribed to.
	 * @param user The resubscribing user.
	 * @param subInfo Additional information about the resubscription.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onResub: (
		handler: (channel: string, user: string, subInfo: ChatSubInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user gifts a subscription to a channel to another user.
	 *
	 * Community subs also fire multiple `onSubGift` events.
	 * To prevent alert spam, check [Sub gift spam](/twitch-chat-client/docs/examples/sub-gift-spam).
	 *
	 * @eventListener
	 * @param channel The channel that was subscribed to.
	 * @param user The user that the subscription was gifted to. The gifting user is defined in `subInfo.gifter`.
	 * @param subInfo Additional information about the subscription.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onSubGift: (
		handler: (channel: string, user: string, subInfo: ChatSubGiftInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user gifts random subscriptions to the community of a channel.
	 *
	 * Community subs also fire multiple `onSubGift` events.
	 * To prevent alert spam, check [Sub gift spam](/twitch-chat-client/docs/examples/sub-gift-spam).
	 *
	 * @eventListener
	 * @param channel The channel that was subscribed to.
	 * @param user The gifting user.
	 * @param subInfo Additional information about the community subscription.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onCommunitySub: (
		handler: (channel: string, user: string, subInfo: ChatCommunitySubInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user extends their subscription using a Sub Token.
	 *
	 * @eventListener
	 * @param channel The channel where the subscription was extended.
	 * @param user The user that extended their subscription.
	 * @param subInfo Additional information about the subscription extension.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onSubExtend: (
		handler: (channel: string, user: string, subInfo: ChatSubExtendInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user gifts rewards during a special event.
	 *
	 * @eventListener
	 * @param channel The channel where the rewards were gifted.
	 * @param user The user that gifted the rewards.
	 * @param rewardGiftInfo Additional information about the reward gift.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onRewardGift: (
		handler: (channel: string, user: string, rewardGiftInfo: ChatRewardGiftInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user upgrades their Prime subscription to a paid subscription in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the subscription was upgraded.
	 * @param user The user that upgraded their subscription.
	 * @param subInfo Additional information about the subscription upgrade.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onPrimePaidUpgrade: (
		handler: (channel: string, user: string, subInfo: ChatSubUpgradeInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user upgrades their gift subscription to a paid subscription in a channel.
	 *
	 * @eventListener
	 * @param channel The channel where the subscription was upgraded.
	 * @param user The user that upgraded their subscription.
	 * @param subInfo Additional information about the subscription upgrade.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onGiftPaidUpgrade: (
		handler: (channel: string, user: string, subInfo: ChatSubGiftUpgradeInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

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
	readonly onPrimeCommunityGift: (
		handler: (channel: string, user: string, subInfo: ChatPrimeCommunityGiftInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user pays forward a subscription that was gifted to them to a specific user.
	 *
	 * @eventListener
	 * @param channel The channel where the gift was forwarded.
	 * @param user The user that forwarded the gift.
	 * @param forwardInfo Additional information about the gift.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onStandardPayForward: (
		handler: (channel: string, user: string, forwardInfo: ChatStandardPayForwardInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when a user pays forward a subscription that was gifted to them to the community.
	 *
	 * @eventListener
	 * @param channel The channel where the gift was forwarded.
	 * @param user The user that forwarded the gift.
	 * @param forwardInfo Additional information about the gift.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onCommunityPayForward: (
		handler: (channel: string, user: string, forwardInfo: ChatCommunityPayForwardInfo, msg: UserNotice) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when receiving a whisper from another user.
	 *
	 * @eventListener
	 * @param user The user that sent the whisper.
	 * @param message The message text.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onWhisper: (
		handler: (user: string, message: string, msg: Whisper) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when you tried to execute a command you don't have sufficient permission for.
	 *
	 * @eventListener
	 * @param channel The channel that a command without sufficient permissions was executed on.
	 * @param message The message text.
	 */
	readonly onNoPermission: (handler: (channel: string, message: string) => void) => Listener = this.registerEvent();

	/**
	 * Fires when a message you tried to send gets rejected by the ratelimiter.
	 *
	 * @eventListener
	 * @param channel The channel that was attempted to send to.
	 * @param message The message text.
	 */
	readonly onMessageRatelimit: (
		handler: (channel: string, message: string) => void
	) => Listener = this.registerEvent();

	/**
	 * Fires when authentication fails.
	 *
	 * @eventListener
	 * @param channel The channel that a command without sufficient permissions was executed on.
	 * @param message The message text.
	 */
	readonly onAuthenticationFailure: (handler: (message: string) => void) => Listener = this.registerEvent();

	/**
	 * Fires when sending a message fails.
	 *
	 * @eventListener
	 * @param channel The channel that rejected the message.
	 * @param reason The reason for the failure, e.g. you're banned (msg_banned)
	 */
	readonly onMessageFailed: (handler: (channel: string, reason: string) => void) => Listener = this.registerEvent();

	/**
	 * Fires when a user sends a message to a channel.
	 *
	 * @eventListener
	 * @param channel The channel the message was sent to.
	 * @param user The user that send the message.
	 * @param message The message text.
	 * @param msg The full message object containing all message and user information.
	 */
	readonly onMessage: (
		handler: (channel: string, user: string, message: string, msg: TwitchPrivateMessage) => void
	) => Listener = this.registerEvent();

	// override for specific class
	/** @private */
	declare readonly onPrivmsg: (
		handler: (channel: string, user: string, message: string, msg: TwitchPrivateMessage) => void
	) => Listener;

	/**
	 * Fires when a user sends an action (/me) to a channel.
	 *
	 * @eventListener
	 * @param channel The channel the action was sent to.
	 * @param user The user that send the action.
	 * @param message The action text.
	 * @param msg The full message object containing all message and user information.
	 */
	declare readonly onAction: (
		handler: (channel: string, user: string, message: string, msg: TwitchPrivateMessage) => void
	) => Listener;

	// internal events to resolve promises and stuff
	private readonly _onBanResult: (
		handler: (channel: string, user: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onTimeoutResult: (
		handler: (channel: string, user: string, duration?: number, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onUnbanResult: (
		handler: (channel: string, user: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onColorResult: (handler: (error?: string) => void) => Listener = this.registerInternalEvent();
	private readonly _onCommercialResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onDeleteMessageResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onEmoteOnlyResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onEmoteOnlyOffResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onFollowersOnlyResult: (
		handler: (channel: string, minFollowTime?: number, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onFollowersOnlyOffResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onHostResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onUnhostResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onModResult: (
		handler: (channel: string, user: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onUnmodResult: (
		handler: (channel: string, user: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onModsResult: (
		handler: (channel: string, mods?: string[], error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onJoinResult: (
		handler: (channel: string, state?: Map<string, string>, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onR9kResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onR9kOffResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onSlowResult: (
		handler: (channel: string, delay?: number, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onSlowOffResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onSubsOnlyResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onSubsOnlyOffResult: (
		handler: (channel: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onVipResult: (
		handler: (channel: string, user: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onUnvipResult: (
		handler: (channel: string, user: string, error?: string) => void
	) => Listener = this.registerInternalEvent();
	private readonly _onVipsResult: (
		handler: (channel: string, vips?: string[], error?: string) => void
	) => Listener = this.registerInternalEvent();

	/**
	 * Creates a new anonymous Twitch chat client.
	 *
	 * @expandParams
	 *
	 * @param options
	 */
	static anonymous(options: ChatClientOptions = {}): ChatClient {
		return new this(undefined, options);
	}

	/**
	 * Creates a new Twitch chat client.
	 *
	 * @expandParams
	 *
	 * @param authProvider The {@AuthProvider} instance to use for authentication.
	 * @param options
	 */
	constructor(authProvider: AuthProvider | undefined, options: ChatClientOptions = {}) {
		super({
			connection: {
				hostName:
					options.hostName ?? (options.webSocket ?? true ? 'irc-ws.chat.twitch.tv' : 'irc.chat.twitch.tv'),
				secure: options.ssl ?? true
			},
			credentials: {
				nick: ''
			},
			webSocket: options.webSocket ?? true,
			logger: options.logger,
			nonConformingCommands: ['004'],
			channels: options.channels
		});

		if (authProvider?.tokenType === 'app') {
			throw new InvalidTokenTypeError(
				'You can not connect to chat using an AuthProvider that supplies app access tokens.\n' +
					'To get an anonymous, read-only connection, please use `ChatClient.anonymous()`.\n' +
					'To get a read-write connection, please provide an auth provider that provides user access tokens, for example `RefreshableAuthProvider`.'
			);
		}

		this._chatLogger = new Logger({
			name: 'twitch-chat',
			emoji: true,
			...options.logger
		});

		this._authProvider = authProvider;

		this._useLegacyScopes = !!options.legacyScopes;
		this._readOnly = !!options.readOnly;

		const executeChatMessageRequest = async ({ type, message, channel, tags }: ChatMessageRequest) => {
			if (type === 'say') {
				super.say(channel, message, tags);
			} else {
				super.action(channel, message);
			}
		};

		const executeJoinRequest = async (channel: string) =>
			new Promise<void>((resolve, reject) => {
				// eslint-disable-next-line @typescript-eslint/init-declarations
				let timer: NodeJS.Timer;
				const e = this._onJoinResult((chan, state, error) => {
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
					reject(
						new Error(`Did not receive a reply to join ${channel} in time; assuming that the join failed`)
					);
				}, 10000);
				super.join(channel);
			});

		const executeWhisperRequest = async ({ target, message }: WhisperRequest) => this._doWhisper(target, message);

		if (options.isAlwaysMod) {
			this._messageRateLimiter = new TimeBasedRateLimiter({
				bucketSize: options.botLevel === 'verified' ? 7500 : 100,
				timeFrame: 32000,
				doRequest: executeChatMessageRequest
			});
		} else {
			let bucketSize = 20;
			if (options.botLevel === 'verified') {
				bucketSize = 7500;
			} else if (options.botLevel === 'known') {
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
			bucketSize: options.botLevel === 'verified' ? 2000 : 20,
			timeFrame: 11000,
			doRequest: executeJoinRequest
		});
		let whisperLimitPerSecond = 3;
		let whisperLimitPerMinute = 100;
		if (options.botLevel === 'verified') {
			whisperLimitPerSecond = 20;
			whisperLimitPerMinute = 1200;
		} else if (options.botLevel === 'known') {
			whisperLimitPerSecond = 10;
			whisperLimitPerMinute = 200;
		}
		this._whisperRateLimiter = new TimedPassthruRateLimiter(
			new TimeBasedRateLimiter({
				bucketSize: whisperLimitPerSecond,
				timeFrame: 1200,
				logger: { minLevel: LogLevel.ERROR },
				doRequest: executeWhisperRequest
			}),
			{ bucketSize: whisperLimitPerMinute, timeFrame: 64000 }
		);

		this.addCapability(TwitchTagsCapability);
		this.addCapability(TwitchCommandsCapability);
		if (options.requestMembershipEvents) {
			this.addCapability(TwitchMembershipCapability);
		}

		this.addInternalListener(this.onRegister, () => {
			this._authVerified = true;
		});

		this.addInternalListener(this.onPrivmsg, (channel, user, message, msg) => {
			if (user === 'jtv') {
				// 1 = who hosted
				// 2 = auto-host or not
				// 3 = how many viewers (not always present)
				const match = ChatClient.HOST_MESSAGE_REGEX.exec(message);
				if (match) {
					this.emit(
						this.onHosted,
						channel,
						match[1],
						Boolean(match[2]),
						match[3] ? Number(match[3]) : undefined
					);
				}
			} else {
				this.emit(this.onMessage, channel, user, message, msg);
			}
		});

		this.onTypedMessage(ClearChat, ({ params: { channel, user }, tags }) => {
			if (user) {
				const duration = tags.get('ban-duration');
				if (duration === undefined) {
					// ban
					this.emit(this.onBan, channel, user);
				} else {
					// timeout
					this.emit(this.onTimeout, channel, user, Number(duration));
					this.emit(this._onTimeoutResult, channel, user, Number(duration));
				}
			} else {
				// full chat clear
				this.emit(this.onChatClear, channel);
			}
		});

		this.onTypedMessage(ClearMsg, msg => {
			const {
				params: { channel },
				targetMessageId
			} = msg;
			this.emit(this.onMessageRemove, channel, targetMessageId, msg);
		});

		this.onTypedMessage(HostTarget, ({ params: { channel, targetAndViewers } }) => {
			const [target, viewers] = targetAndViewers.split(' ');
			if (target === '-') {
				// unhost
				this.emit(this.onUnhost, channel);
			} else {
				const numViewers = Number(viewers);
				this.emit(this.onHost, channel, target, isNaN(numViewers) ? undefined : numViewers);
			}
		});

		this.onTypedMessage(MessageTypes.Commands.ChannelJoin, ({ prefix, params: { channel } }) => {
			this.emit(this.onJoin, channel, prefix!.nick);
		});

		this.onTypedMessage(MessageTypes.Commands.ChannelPart, ({ prefix, params: { channel } }) => {
			this.emit(this.onPart, channel, prefix!.nick);
		});

		this.onTypedMessage(RoomState, ({ params: { channel }, tags }) => {
			let isInitial = false;
			if (tags.has('subs-only') && tags.has('slow')) {
				// this is the full state - so we just successfully joined
				this.emit(this._onJoinResult, channel, tags);
				isInitial = true;
			}

			if (tags.has('slow')) {
				const slowDelay = Number(tags.get('slow'));
				if (slowDelay) {
					this.emit(this._onSlowResult, channel, slowDelay);
					if (!isInitial) {
						this.emit(this.onSlow, channel, true, slowDelay);
					}
				} else {
					this.emit(this._onSlowOffResult, channel);
					if (!isInitial) {
						this.emit(this.onSlow, channel, false);
					}
				}
			}

			if (tags.has('followers-only')) {
				const followDelay = Number(tags.get('followers-only'));
				if (followDelay === -1) {
					this.emit(this._onFollowersOnlyOffResult, channel);
					if (!isInitial) {
						this.emit(this.onFollowersOnly, channel, false);
					}
				} else {
					this.emit(this._onFollowersOnlyResult, channel, followDelay);
					if (!isInitial) {
						this.emit(this.onFollowersOnly, channel, true, followDelay);
					}
				}
			}
		});

		this.onTypedMessage(UserNotice, userNotice => {
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
					this.emit(event, channel, tags.get('login')!, subInfo, userNotice);
					break;
				}
				case 'subgift':
				case 'anonsubgift': {
					const plan = tags.get('msg-param-sub-plan')!;
					const gifter = tags.get('login');
					const isAnon = messageType === 'anonsubgift' || gifter === 'ananonymousgifter';
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
				case 'anonsubmysterygift':
				case 'submysterygift': {
					const gifter = tags.get('login');
					const isAnon = messageType === 'anonsubmysterygift' || gifter === 'ananonymousgifter';
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
						plan: tags.get('msg-param-sub-plan')!,
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
				default: {
					this._chatLogger.warn(`Unrecognized usernotice ID: ${messageType}`);
				}
			}
		});

		this.onTypedMessage(Whisper, whisper => {
			this.emit(this.onWhisper, whisper.prefix!.nick, whisper.params.message, whisper);
		});

		this.onTypedMessage(MessageTypes.Commands.Notice, async ({ params: { target: channel, message }, tags }) => {
			const messageType = tags.get('msg-id');

			// this event handler involves a lot of parsing strings you shouldn't parse...
			// but Twitch doesn't give us the required info in tags (╯°□°）╯︵ ┻━┻
			// (this code also might not do the right thing with foreign character display names...)
			switch (messageType) {
				// ban
				case 'already_banned': {
					const match = message.split(' ');
					const user = /^\w+$/.test(match[0]) ? match[0] : undefined;
					if (user) {
						this.emit(this._onBanResult, channel, user, messageType);
					}
					break;
				}

				case 'bad_ban_self': {
					this.emit(this._onBanResult, channel, this._credentials.nick, messageType);
					break;
				}

				case 'bad_ban_broadcaster': {
					this.emit(this._onBanResult, channel, toUserName(channel), messageType);
					break;
				}

				case 'bad_ban_admin':
				case 'bad_ban_global_mod':
				case 'bad_ban_staff': {
					const match = /^You cannot ban (?:\w+ )+?(\w+)\.$/.exec(message);
					if (match) {
						this.emit(this._onBanResult, channel, match[1].toLowerCase(), messageType);
					}
					break;
				}

				case 'ban_success': {
					const match = message.split(' ');
					const user = /^\w+$/.test(match[0]) ? match[0] : undefined;
					if (user) {
						this.emit(this._onBanResult, channel, user);
					}
					break;
				}

				// unban
				case 'bad_unban_no_ban': {
					const match = message.split(' ');
					const user = /^\w+$/.test(match[0]) ? match[0] : undefined;
					if (user) {
						this.emit(this._onUnbanResult, channel, user, messageType);
					}
					break;
				}

				case 'unban_success': {
					const match = message.split(' ');
					const user = /^\w+$/.test(match[0]) ? match[0] : undefined;
					if (user) {
						this.emit(this._onUnbanResult, channel, user);
					}
					break;
				}

				// color
				case 'turbo_only_color': {
					this.emit(this._onColorResult, messageType);
					break;
				}

				case 'color_changed': {
					this.emit(this._onColorResult);
					break;
				}

				// commercial
				case 'bad_commercial_error': {
					this.emit(this._onCommercialResult, channel, messageType);
					break;
				}

				case 'commercial_success': {
					this.emit(this._onCommercialResult, channel);
					break;
				}

				// delete message
				case 'bad_delete_message_error':
				case 'bad_delete_message_broadcaster':
				case 'bad_delete_message_mod': {
					this.emit(this._onDeleteMessageResult, channel, messageType);
					break;
				}

				case 'delete_message_success': {
					this.emit(this._onDeleteMessageResult, channel);
					break;
				}

				// emote only
				case 'already_emote_only_on': {
					this.emit(this._onEmoteOnlyResult, channel, messageType);
					break;
				}

				case 'emote_only_on': {
					this.emit(this._onEmoteOnlyResult, channel);
					this.emit(this.onEmoteOnly, channel, true);
					break;
				}

				// emote only off
				case 'already_emote_only_off': {
					this.emit(this._onEmoteOnlyOffResult, channel, messageType);
					break;
				}

				case 'emote_only_off': {
					this.emit(this._onEmoteOnlyOffResult, channel);
					this.emit(this.onEmoteOnly, channel, false);
					break;
				}

				// host
				case 'bad_host_hosting':
				case 'bad_host_rate_exceeded':
				case 'bad_host_error': {
					this.emit(this._onHostResult, channel, messageType);
					break;
				}

				case 'hosts_remaining': {
					const remainingHostsFromChar = +message[0];
					const remainingHosts = isNaN(remainingHostsFromChar) ? 0 : Number(remainingHostsFromChar);
					this.emit(this._onHostResult, channel);
					this.emit(this.onHostsRemaining, channel, remainingHosts);
					break;
				}

				// unhost (only fails, success is handled by HOSTTARGET)
				case 'not_hosting': {
					this.emit(this._onUnhostResult, channel, messageType);
					break;
				}

				// join (success is handled when ROOMSTATE comes in)
				case 'msg_channel_suspended': {
					this.emit(this._onJoinResult, channel, undefined, messageType);
					break;
				}

				// mod
				case 'bad_mod_banned':
				case 'bad_mod_mod': {
					const match = message.split(' ');
					const user = /^\w+$/.test(match[0]) ? match[0] : undefined;
					if (user) {
						this.emit(this._onModResult, channel, user, messageType);
					}
					break;
				}

				case 'mod_success': {
					const match = /^You have added (\w+) /.exec(message);
					if (match) {
						this.emit(this._onModResult, channel, match[1]);
					}
					break;
				}

				// unmod
				case 'bad_unmod_mod': {
					const match = message.split(' ');
					const user = /^\w+$/.test(match[0]) ? match[0] : undefined;
					if (user) {
						this.emit(this._onUnmodResult, channel, user, messageType);
					}
					break;
				}

				case 'unmod_success': {
					const match = /^You have removed (\w+) /.exec(message);
					if (match) {
						this.emit(this._onUnmodResult, channel, match[1]);
					}
					break;
				}

				// mods
				case 'no_mods': {
					this.emit(this._onModsResult, channel, []);
					break;
				}

				case 'room_mods': {
					const [, modList] = message.split(': ');
					const mods = modList.split(', ');
					this.emit(this._onModsResult, channel, mods);
					break;
				}

				// r9k
				case 'already_r9k_on': {
					this.emit(this._onR9kResult, channel, messageType);
					break;
				}

				case 'r9k_on': {
					this.emit(this._onR9kResult, channel);
					this.emit(this.onR9k, channel, true);
					break;
				}

				// r9k off
				case 'already_r9k_off': {
					this.emit(this._onR9kOffResult, channel, messageType);
					break;
				}

				case 'r9k_off': {
					this.emit(this._onR9kOffResult, channel);
					this.emit(this.onR9k, channel, false);
					break;
				}

				// subs only
				case 'already_subs_on': {
					this.emit(this._onSubsOnlyResult, channel, messageType);
					break;
				}

				case 'subs_on': {
					this.emit(this._onSubsOnlyResult, channel);
					this.emit(this.onSubsOnly, channel, true);
					break;
				}

				// subs only off
				case 'already_subs_off': {
					this.emit(this._onSubsOnlyOffResult, channel, messageType);
					break;
				}

				case 'subs_off': {
					this.emit(this._onSubsOnlyOffResult, channel);
					this.emit(this.onSubsOnly, channel, false);
					break;
				}

				// timeout (only fails, success is handled by CLEARCHAT)
				case 'bad_timeout_self': {
					this.emit(this._onTimeoutResult, channel, this._credentials.nick, undefined, messageType);
					break;
				}

				case 'bad_timeout_broadcaster': {
					this.emit(this._onTimeoutResult, channel, toUserName(channel), undefined, messageType);
					break;
				}

				case 'bad_timeout_mod': {
					const match = /^You cannot timeout moderator (\w+) unless/.exec(message);
					if (match) {
						this.emit(this._onTimeoutResult, channel, toUserName(match[1]), undefined, messageType);
					}
					break;
				}

				case 'bad_timeout_admin':
				case 'bad_timeout_global_mod':
				case 'bad_timeout_staff': {
					const match = /^You cannot ban (?:\w+ )+?(\w+)\.$/.exec(message);
					if (match) {
						this.emit(this._onTimeoutResult, channel, toUserName(match[1]), undefined, messageType);
					}
					break;
				}

				// vip
				case 'bad_vip_grantee_banned':
				case 'bad_vip_grantee_already_vip': {
					const match = message.split(' ');
					const user = /^\w+$/.test(match[0]) ? match[0] : undefined;
					if (user) {
						this.emit(this._onVipResult, channel, user, messageType);
					}
					break;
				}

				case 'vip_success': {
					const match = /^You have added (\w+) /.exec(message);
					if (match) {
						this.emit(this._onVipResult, channel, match[1]);
					}
					break;
				}

				// unvip
				case 'bad_unvip_grantee_not_vip': {
					const match = message.split(' ');
					const user = /^\w+$/.test(match[0]) ? match[0] : undefined;
					if (user) {
						this.emit(this._onUnvipResult, channel, user, messageType);
					}
					break;
				}

				case 'unvip_success': {
					const match = /^You have removed (\w+) /.exec(message);
					if (match) {
						this.emit(this._onUnvipResult, channel, match[1]);
					}
					break;
				}

				// vips
				case 'no_vips': {
					this.emit(this._onVipsResult, channel, []);
					break;
				}

				case 'vips_success': {
					const [, vipList] = message.split(': ');
					const vips = vipList.split(', ');
					this.emit(this._onVipsResult, channel, vips);
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

				// ...and HOSTTARGET
				case 'host_off':
				case 'host_on':
				case 'host_target_went_offline': {
					break;
				}

				case 'unrecognized_cmd': {
					break;
				}

				case 'no_permission': {
					this.emit(this.onNoPermission, channel, message);
					break;
				}

				case 'msg_ratelimit': {
					this.emit(this.onMessageRatelimit, channel, message);
					break;
				}

				case 'msg_banned': {
					this.emit(this.onMessageFailed, channel, messageType);
					break;
				}

				case undefined: {
					// this might be one of these weird authentication error notices that don't have a msg-id...
					if (
						message === 'Login authentication failed' ||
						message === 'Improperly formatted AUTH' ||
						message === 'Invalid NICK'
					) {
						this._authVerified = false;
						this.emit(this.onAuthenticationFailure, message);
						if (!this._authRetryTimer) {
							this._authRetryTimer = ChatClient._getReauthenticateWaitTime();
						}
						const secs = this._authRetryTimer.next().value;
						if (secs !== 0) {
							this._chatLogger.info(`Retrying authentication in ${secs} seconds`);
						}
						await delay(secs * 1000);
						await this.reconnect();
					}
					break;
				}

				default: {
					if (!messageType || messageType.substr(0, 6) !== 'usage_') {
						this._chatLogger.warn(`Unrecognized notice ID: '${messageType}'`);
					}
				}
			}
		});
	}

	async connect(): Promise<void> {
		if (!this._authProvider) {
			this._updateCredentials({
				nick: ChatClient._generateJustinfanNick(),
				password: undefined
			});
		}

		await super.connect();
	}

	/**
	 * Hosts a channel on another channel.
	 *
	 * @param target The host target, i.e. the channel that is being hosted.
	 * @param channel The host source, i.e. the channel that is hosting. Defaults to the channel of the connected user.
	 */
	async host(channel: string | undefined, target: string): Promise<void> {
		const channelName = toUserName(channel ?? this._credentials.nick);
		return new Promise<void>((resolve, reject) => {
			const e = this._onHostResult((chan, error) => {
				if (toUserName(chan) === channelName) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channelName, `/host ${target}`);
		});
	}

	/**
	 * Ends any host on a channel.
	 *
	 * This only works when in the channel that was hosted in order to provide feedback about success of the command.
	 *
	 * If you don't need this feedback, consider using {@ChatClient#unhostOutside} instead.
	 *
	 * @param channel The channel to end the host on. Defaults to the channel of the connected user.
	 */
	async unhost(channel: string = this._credentials.nick): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onUnhostResult((chan, error) => {
				if (toUserName(chan) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/unhost');
		});
	}

	/**
	 * Ends any host on a channel.
	 *
	 * This works even when not in the channel that was hosted, but provides no feedback about success of the command.
	 *
	 * If you need feedback about success, use {@ChatClient#unhost} (but make sure you're in the channel you are hosting).
	 *
	 * @param channel The channel to end the host on. Defaults to the channel of the connected user.
	 */
	async unhostOutside(channel: string = this._credentials.nick): Promise<void> {
		return this.say(channel, '/unhost');
	}

	/**
	 * Bans a user from a channel.
	 *
	 * @param channel The channel to ban the user from. Defaults to the channel of the connected user.
	 * @param user The user to ban from the channel.
	 * @param reason The reason for the ban.
	 */
	async ban(channel: string | undefined, user: string, reason: string = ''): Promise<void> {
		const channelName = toUserName(channel ?? this._credentials.nick);
		user = toUserName(user);
		return new Promise<void>((resolve, reject) => {
			const e = this._onBanResult((_channel, _user, error) => {
				if (toUserName(_channel) === channelName && toUserName(_user) === user) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channelName, `/ban ${user} ${reason}`);
		});
	}

	/**
	 * Clears all messages in a channel.
	 *
	 * @param channel The channel to ban the user from. Defaults to the channel of the connected user.
	 */
	async clear(channel: string = this._credentials.nick): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>(resolve => {
			const e = this.addInternalListener(this.onChatClear, _channel => {
				if (toUserName(_channel) === channel) {
					resolve();
					e.unbind();
				}
			});
			void this.say(channel, '/clear');
		});
	}

	/**
	 * Changes your username color.
	 *
	 * @param color The hexadecimal code (prefixed with #) or color name to use for your username.
	 *
	 * Please note that only Twitch Turbo or Prime users can use hexadecimal codes for arbitrary colors.
	 *
	 * If you have neither of those, you can only choose from the following color names:
	 *
	 * Blue, BlueViolet, CadetBlue, Chocolate, Coral, DodgerBlue, Firebrick, GoldenRod, Green, HotPink, OrangeRed, Red, SeaGreen, SpringGreen, YellowGreen
	 */
	async changeColor(color: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const e = this._onColorResult(error => {
				if (error) {
					reject(error);
				} else {
					resolve();
				}
				this.removeListener(e);
			});
			void this.say(GENERIC_CHANNEL, `/color ${color}`);
		});
	}

	/**
	 * Runs a commercial break on a channel.
	 *
	 * @param channel The channel to run the commercial break on.
	 * @param duration The duration of the commercial break.
	 */
	async runCommercial(channel: string, duration: CommercialLength): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onCommercialResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/commercial ${duration}`);
		});
	}

	/**
	 * Deletes a message from a channel.
	 *
	 * @param channel The channel to delete the message from.
	 * @param message The message (as message ID or message object) to delete.
	 */
	async deleteMessage(channel: string, message: string | TwitchPrivateMessage): Promise<void> {
		channel = toUserName(channel);
		const messageId = extractMessageId(message);
		return new Promise<void>((resolve, reject) => {
			const e = this._onDeleteMessageResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/delete ${messageId}`);
		});
	}

	/**
	 * Enables emote-only mode in a channel.
	 *
	 * @param channel The channel to enable emote-only mode in.
	 */
	async enableEmoteOnly(channel: string): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onEmoteOnlyResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/emoteonly');
		});
	}

	/**
	 * Disables emote-only mode in a channel.
	 *
	 * @param channel The channel to disable emote-only mode in.
	 */
	async disableEmoteOnly(channel: string): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onEmoteOnlyOffResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/emoteonlyoff');
		});
	}

	/**
	 * Enables followers-only mode in a channel.
	 *
	 * @param channel The channel to enable followers-only mode in.
	 * @param minFollowTime The time (in minutes) a user needs to be following before being able to send messages.
	 */
	async enableFollowersOnly(channel: string, minFollowTime: number = 0): Promise<void> {
		if (!Number.isInteger(minFollowTime) || minFollowTime < 0 || minFollowTime > 129600) {
			throw new Error(
				`Invalid minimum follow time: ${minFollowTime}. It must be an integer between 0 and 129600.`
			);
		}
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onFollowersOnlyResult((_channel, _minFollowTime, error) => {
				if (toUserName(_channel) === channel && _minFollowTime === minFollowTime) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/followers ${minFollowTime || ''}`);
		});
	}

	/**
	 * Disables followers-only mode in a channel.
	 *
	 * @param channel The channel to disable followers-only mode in.
	 */
	async disableFollowersOnly(channel: string): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onFollowersOnlyOffResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/followersoff');
		});
	}

	/**
	 * Gives a user moderator rights in a channel.
	 *
	 * @param channel The channel to give the user moderator rights in.
	 * @param user The user to give moderator rights.
	 */
	async mod(channel: string, user: string): Promise<void> {
		channel = toUserName(channel);
		user = toUserName(user);
		return new Promise<void>((resolve, reject) => {
			const e = this._onModResult((_channel, _user, error) => {
				if (toUserName(_channel) === channel && toUserName(_user) === user) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/mod ${user}`);
		});
	}

	/**
	 * Takes moderator rights from a user in a channel.
	 *
	 * @param channel The channel to remove the user's moderator rights in.
	 * @param user The user to take moderator rights from.
	 */
	async unmod(channel: string, user: string): Promise<void> {
		channel = toUserName(channel);
		user = toUserName(user);
		return new Promise<void>((resolve, reject) => {
			const e = this._onUnmodResult((_channel, _user, error) => {
				if (toUserName(_channel) === channel && toUserName(_user) === user) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/unmod ${user}`);
		});
	}

	/**
	 * Retrieves a list of moderators in a channel.
	 *
	 * @param channel The channel to retrieve the moderators of.
	 */
	async getMods(channel: string): Promise<string[]> {
		channel = toUserName(channel);
		return new Promise<string[]>(resolve => {
			const e = this._onModsResult((_channel, mods) => {
				if (toUserName(_channel) === channel) {
					resolve(mods!);
					this.removeListener(e);
				}
			});
			void this.say(channel, '/mods');
		});
	}

	/**
	 * Enables r9k mode in a channel.
	 *
	 * @param channel The channel to enable r9k mode in.
	 */
	async enableR9k(channel: string): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onR9kResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/r9kbeta');
		});
	}

	/**
	 * Disables r9k mode in a channel.
	 *
	 * @param channel The channel to disable r9k mode in.
	 */
	async disableR9k(channel: string): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onR9kOffResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/r9kbetaoff');
		});
	}

	/**
	 * Enables slow mode in a channel.
	 *
	 * @param channel The channel to enable slow mode in.
	 * @param delayBetweenMessages The time (in seconds) a user needs to wait between messages.
	 */
	async enableSlow(channel: string, delayBetweenMessages: number = 30): Promise<void> {
		if (!Number.isInteger(delayBetweenMessages) || delayBetweenMessages < 1 || delayBetweenMessages > 1800) {
			throw new Error(
				`Invalid delay between messages: ${delayBetweenMessages}. It must be an integer between 1 and 1800.`
			);
		}
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onSlowResult((_channel, _delay, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/slow ${delayBetweenMessages}`);
		});
	}

	/**
	 * Disables slow mode in a channel.
	 *
	 * @param channel The channel to disable slow mode in.
	 */
	async disableSlow(channel: string): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onSlowOffResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/slowoff');
		});
	}

	/**
	 * Enables subscribers-only mode in a channel.
	 *
	 * @param channel The channel to enable subscribers-only mode in.
	 */
	async enableSubsOnly(channel: string): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onSubsOnlyResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/subscribers');
		});
	}

	/**
	 * Disables subscribers-only mode in a channel.
	 *
	 * @param channel The channel to disable subscribers-only mode in.
	 */
	async disableSubsOnly(channel: string): Promise<void> {
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onSubsOnlyOffResult((_channel, error) => {
				if (toUserName(_channel) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, '/subscribersoff');
		});
	}

	/**
	 * Times out a user in a channel and removes all their messages.
	 *
	 * @param channel The channel to time out the user in.
	 * @param user The user to time out.
	 * @param duration The time (in seconds) until the user can send messages again. Defaults to 1 minute.
	 * @param reason
	 */
	async timeout(channel: string, user: string, duration: number = 60, reason: string = ''): Promise<void> {
		if (!Number.isInteger(duration) || duration < 1 || duration > 1209600) {
			throw new Error(`Invalid timeout duration: ${duration}. It must be an integer between 1 and 1209600.`);
		}
		channel = toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onTimeoutResult((_channel, _user, _duration, error) => {
				if (toUserName(_channel) === channel && toUserName(_user) === user) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/timeout ${user} ${duration} ${reason}`);
		});
	}

	/**
	 * Removes all messages of a user from a channel.
	 *
	 * @param channel The channel to purge the user's messages from.
	 * @param user The user to purge.
	 * @param reason The reason for the purge.
	 */
	async purge(channel: string, user: string, reason: string = ''): Promise<void> {
		return this.timeout(channel, user, 1, reason);
	}

	/**
	 * Gives a user VIP status in a channel.
	 *
	 * @param channel The channel to give the user VIP status in.
	 * @param user The user to give VIP status.
	 */
	async addVip(channel: string, user: string): Promise<void> {
		channel = toUserName(channel);
		user = toUserName(user);
		return new Promise<void>((resolve, reject) => {
			const e = this._onVipResult((_channel, _user, error) => {
				if (toUserName(_channel) === channel && toUserName(_user) === user) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/vip ${user}`);
		});
	}

	/**
	 * Takes VIP status from a user in a channel.
	 *
	 * @param channel The channel to remove the user's VIP status in.
	 * @param user The user to take VIP status from.
	 */
	async removeVip(channel: string, user: string): Promise<void> {
		channel = toUserName(channel);
		user = toUserName(user);
		return new Promise<void>((resolve, reject) => {
			const e = this._onUnvipResult((_channel, _user, error) => {
				if (toUserName(_channel) === channel && toUserName(_user) === user) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			void this.say(channel, `/unvip ${user}`);
		});
	}

	/**
	 * Retrieves a list of VIPs in a channel.
	 *
	 * @param channel The channel to retrieve the VIPs of.
	 */
	async getVips(channel: string): Promise<string[]> {
		channel = toUserName(channel);
		return new Promise<string[]>(resolve => {
			const e = this._onVipsResult((_channel, vips) => {
				if (toUserName(_channel) === channel) {
					resolve(vips!);
					this.removeListener(e);
				}
			});
			void this.say(channel, '/vips');
		});
	}

	/**
	 * Sends a message to a channel.
	 *
	 * @param channel The channel to send the message to.
	 * @param message The message to send.
	 * @param attributes The attributes to add to the message.
	 */
	async say(channel: string, message: string, attributes: ChatSayMessageAttributes = {}): Promise<void> {
		const tags: Record<string, string> = {};
		if (attributes.replyTo) {
			tags['reply-parent-msg-id'] = extractMessageId(attributes.replyTo);
		}
		return this._messageRateLimiter.request({
			type: 'say',
			channel: toChannelName(channel),
			message,
			tags
		});
	}

	/**
	 * Sends an action message (/me) to a channel.
	 *
	 * @param channel The channel to send the message to.
	 * @param message The message to send.
	 */
	async action(channel: string, message: string): Promise<void> {
		return this._messageRateLimiter.request({
			type: 'action',
			channel: toChannelName(channel),
			message
		});
	}

	/**
	 * Sends a whisper message to another user.
	 *
	 * @param user The user to send the message to.
	 * @param message The message to send.
	 */
	async whisper(user: string, message: string): Promise<void> {
		if (!this._needToShowWhisperWarning) {
			this._needToShowWhisperWarning = false;
			this._chatLogger.warn(
				`You did not set a botLevel option.
Pleasae note that your whispers might not arrive reliably if your bot is not a known or verified bot.`
			);
		}
		return this._whisperRateLimiter.request({
			target: toUserName(user),
			message
		});
	}

	/**
	 * Joins a channel.
	 *
	 * @param channel The channel to join.
	 */
	async join(channel: string): Promise<void> {
		return this._joinRateLimiter.request(toChannelName(channel));
	}

	/**
	 * Leaves a channel ("part" in IRC terms).
	 *
	 * @param channel The channel to leave.
	 */
	part(channel: string): void {
		super.part(toChannelName(channel));
	}

	/**
	 * Disconnects from the chat server.
	 */
	async quit(): Promise<void> {
		void this._connection.disconnect().then(() => {
			this._chatLogger.debug('Finished cleaning up old connection');
		});
	}

	protected registerCoreMessageTypes(): void {
		super.registerCoreMessageTypes();
		this.registerMessageType(TwitchPrivateMessage);
	}

	protected async getPassword(): Promise<string | undefined> {
		if (!this._authProvider) {
			return undefined;
		}

		if (this._authToken && !this._authToken.isExpired && this._authVerified) {
			this._chatLogger.debug('AccessToken assumed to be correct from last connection');
			return `oauth:${this._authToken.accessToken}`;
		}

		const scopes = this._getNecessaryScopes();
		let lastTokenError: InvalidTokenError | undefined = undefined;

		try {
			this._authToken = await this._authProvider.getAccessToken(scopes);
			if (this._authToken) {
				const token = await getTokenInfo(this._authToken.accessToken);
				this._updateCredentials({
					nick: token.userName
				});
				return `oauth:${this._authToken.accessToken}`;
			}
		} catch (e: unknown) {
			if (e instanceof InvalidTokenError) {
				lastTokenError = e;
			} else {
				this._chatLogger.error(`Retrieving an access token failed: ${(e as Error).message}`);
			}
		}

		this._chatLogger.warn('No valid token available; trying to refresh');

		try {
			this._authToken = await this._authProvider.refresh?.();

			if (this._authToken) {
				const token = await getTokenInfo(this._authToken.accessToken);
				this._updateCredentials({
					nick: token.userName
				});
				return `oauth:${this._authToken.accessToken}`;
			}
		} catch (e: unknown) {
			if (e instanceof InvalidTokenError) {
				lastTokenError = e;
			} else {
				this._chatLogger.error(`Refreshing the access token failed: ${(e as Error).message}`);
			}
		}

		this._authVerified = false;
		throw lastTokenError ?? new Error('Could not retrieve a valid token');
	}

	private _doWhisper(user: string, message: string): void {
		super.say(GENERIC_CHANNEL, `/w ${user} ${message}`);
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

	// yes, this is just fibonacci with a limit
	private static *_getReauthenticateWaitTime(): Iterator<number, never> {
		let current = 0;
		let next = 1;

		while (current < 120) {
			yield current;
			[current, next] = [next, current + next];
		}

		while (true) {
			yield 120;
		}
	}
}
