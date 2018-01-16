import { Client as IRCClient } from 'ircv3';
import { Listener } from 'ircv3/lib/TypedEventEmitter';

import ChatSubInfo, { ChatSubGiftInfo } from './ChatSubInfo';
import UserTools from '../Toolkit/UserTools';

import TwitchTagsCapability from './Capabilities/TwitchTags/';
import TwitchCommandsCapability from './Capabilities/TwitchCommands/';
import TwitchMembershipCapability from './Capabilities/TwitchMembership';

import { Notice, ChannelJoin, ChannelPart } from 'ircv3/lib/Message/MessageTypes/Commands/';
import ClearChat from './Capabilities/TwitchCommands/MessageTypes/ClearChat';
import HostTarget from './Capabilities/TwitchCommands/MessageTypes/HostTarget';
import RoomState from './Capabilities/TwitchCommands/MessageTypes/RoomState';
import UserNotice from './Capabilities/TwitchCommands/MessageTypes/UserNotice';
import Whisper from './Capabilities/TwitchCommands/MessageTypes/Whisper';
import Twitch from '../';
import { NonEnumerable } from '../Toolkit/Decorators';
import TwitchPrivateMessage from './StandardCommands/PrivateMessage';

export default class ChatClient extends IRCClient {
	private static readonly HOST_MESSAGE_REGEX =
		/(\w+) is now ((?:auto[- ])?)hosting you(?: for (?:up to )?(\d+))?/;

	@NonEnumerable _twitchClient: Twitch;

	onTimeout: (handler: (channel: string, user: string, reason: string, duration: number) => void)
		=> Listener = this.registerEvent();
	onBan: (handler: (channel: string, user: string, reason: string) => void) => Listener = this.registerEvent();
	onChatClear: (handler: (channel: string) => void) => Listener = this.registerEvent();
	onEmoteOnly: (handler: (channel: string, enabled: boolean) => void) => Listener = this.registerEvent();
	onFollowersOnly: (handler: (channel: string, enabled: boolean, delay?: number) => void)
		=> Listener = this.registerEvent();
	onHost: (handler: (channel: string, target: string, viewers?: number) => void) => Listener = this.registerEvent();
	onHosted: (handler: (channel: string, byChannel: string, auto: boolean, viewers?: number) => void)
		=> Listener = this.registerEvent();
	onHostsRemaining: (handler: (channel: string, numberOfHosts: number) => void)
		=> Listener = this.registerEvent();
	onJoin: (handler: (channel: string, user: string) => void) => Listener = this.registerEvent();
	onPart: (handler: (channel: string, user: string) => void) => Listener = this.registerEvent();
	onR9k: (handler: (channel: string, enabled: boolean) => void) => Listener = this.registerEvent();
	onUnhost: (handler: (channel: string) => void) => Listener = this.registerEvent();
	onSlow: (handler: (channel: string, enabled: boolean, delay?: number) => void) => Listener = this.registerEvent();
	onSubsOnly: (handler: (channel: string, enabled: boolean) => void) => Listener = this.registerEvent();
	onSub: (handler: (channel: string, user: string, subInfo: ChatSubInfo, msg: UserNotice) => void)
		=> Listener = this.registerEvent();
	onResub: (handler: (channel: string, user: string, subInfo: ChatSubInfo, msg: UserNotice) => void)
		=> Listener = this.registerEvent();
	onSubGift: (handler: (channel: string, user: string, subInfo: ChatSubGiftInfo, msg: UserNotice) => void)
		=> Listener = this.registerEvent();
	onWhisper: (handler: (user: string, message: string, msg: Whisper) => void) => Listener = this.registerEvent();

	// override for specific class
	onPrivmsg: (handler: (target: string, user: string, message: string, msg: TwitchPrivateMessage) => void) => Listener;

	// internal events to resolve promises and stuff
	private readonly _onBanResult: (handler: (channel: string, user: string, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onTimeoutResult:
		(handler: (channel: string, user: string, duration?: number, reason?: string, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onUnbanResult: (handler: (channel: string, user: string, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onColorResult: (handler: (error?: string) => void) => Listener = this.registerEvent();
	private readonly _onCommercialResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();
	private readonly _onEmoteOnlyResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();
	private readonly _onEmoteOnlyOffResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();
	private readonly _onFollowersOnlyResult: (handler: (channel: string, delay?: number, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onFollowersOnlyOffResult: (handler: (channel: string, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onHostResult: (handler: (channel: string, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onUnhostResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();
	private readonly _onModResult: (handler: (channel: string, user: string, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onUnmodResult: (handler: (channel: string, user: string, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onModsResult: (handler: (channel: string, mods?: string[], error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onJoinResult: (handler: (channel: string, state?: Map<string, string>, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onR9kResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();
	private readonly _onR9kOffResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();
	private readonly _onSlowResult: (handler: (channel: string, delay?: number, error?: string) => void)
		=> Listener = this.registerEvent();
	private readonly _onSlowOffResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();
	private readonly _onSubsOnlyResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();
	private readonly _onSubsOnlyOffResult: (handler: (channel: string, error?: string) => void) => Listener = this.registerEvent();

	constructor(username: string, token: string, twitchClient: Twitch, debugLevel: number = 0) {
		super({
			connection: {
				hostName: 'irc-ws.chat.twitch.tv',
				nick: username.toLowerCase(),
				password: `oauth:${token}`,
				secure: true
			},
			webSocket: true,
			debugLevel
		});

		this._twitchClient = twitchClient;

		// tslint:disable:no-floating-promises
		this.registerCapability(TwitchTagsCapability);
		this.registerCapability(TwitchCommandsCapability);
		this.registerCapability(TwitchMembershipCapability);
		// tslint:enable:no-floating-promises

		this.onMessage(ClearChat, ({params: {channel, user}, tags}: ClearChat) => {
			if (user) {
				const duration = tags.get('ban-duration');
				const reason = tags.get('ban-reason');
				if (duration !== undefined) {
					// timeout
					this.emit(this.onTimeout, channel, user, reason, Number(duration));
					this.emit(this._onTimeoutResult, channel, user, reason, Number(duration));
				} else {
					// ban
					this.emit(this.onBan, channel, user, reason);
				}
			} else {
				// full chat clear
				this.emit(this.onChatClear, channel);
			}
		});

		this.onMessage(HostTarget, (hostMessage: HostTarget) => {
			const {params: {channel, targetAndViewers}} = hostMessage;
			const [target, viewers] = targetAndViewers.split(' ');
			if (target === '-') {
				// unhost
				this.emit(this.onUnhost, channel);
			} else {
				this.emit(this.onHost, channel, target, viewers ? Number(viewers) : undefined);
			}
		});

		this.onMessage(ChannelJoin, (joinMessage: ChannelJoin) => {
			const {prefix, params: {channel}} = joinMessage;
			this.emit(this.onJoin, channel, prefix!.nick);
		});

		this.onMessage(ChannelPart, (partMessage: ChannelPart) => {
			const {prefix, params: {channel}} = partMessage;
			this.emit(this.onPart, channel, prefix!.nick);
		});

		this.onMessage(TwitchPrivateMessage, (msg: TwitchPrivateMessage) => {
			const {prefix, params: {target: channel, message}} = msg;
			if (prefix && prefix.nick === 'jtv') {
				// 1 = who hosted
				// 2 = auto-host or not
				// 3 = how many viewers (not always present)
				const match = message.match(ChatClient.HOST_MESSAGE_REGEX);
				if (match) {
					this.emit(this.onHosted, channel, match[1], Boolean(match[2]), match[3] === '' ? Number(match[3]) : undefined);
				}
			}
		});

		this.onMessage(RoomState, (stateMessage: RoomState) => {
			const {params: {channel}, tags} = stateMessage;

			let isInitial = false;
			if (tags.has('subs-only') && tags.has('slow')) {
				// this is the full state - so we just successfully joined
				this.emit(this._onJoinResult, channel, tags);
				isInitial = true;
			}

			if (tags.has('slow')) {
				const slowDelay = Number(tags.get('slow'));
				if (!slowDelay) {
					this.emit(this._onSlowOffResult, channel);
					if (!isInitial) {
						this.emit(this.onSlow, channel, false);
					}
				} else {
					this.emit(this._onSlowResult, channel, slowDelay);
					if (!isInitial) {
						this.emit(this.onSlow, channel, true, slowDelay);
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

		this.onMessage(UserNotice, (userNotice: UserNotice) => {
			const {params: {channel, message}, tags} = userNotice;
			const messageType = tags.get('msg-id');

			if (messageType === 'sub' || messageType === 'resub') {
				const event = messageType === 'sub' ? this.onSub : this.onResub;
				const plan = tags.get('msg-param-sub-plan')!;
				const subInfo: ChatSubInfo = {
					displayName: tags.get('display-name')!,
					plan,
					planName: tags.get('msg-param-sub-plan-name')!,
					isPrime: plan === 'Prime',
					streak: Number(tags.get('msg-param-months')),
					message
				};
				this.emit(event, channel, tags.get('login')!, subInfo, userNotice);
			} else if (messageType === 'subgift') {
				const plan = tags.get('msg-param-sub-plan')!;
				const subInfo: ChatSubGiftInfo = {
					displayName: tags.get('msg-param-recipient-display-name')!,
					gifter: tags.get('login')!,
					gifterDisplayName: tags.get('display-name')!,
					plan,
					planName: tags.get('msg-param-sub-plan-name')!,
					isPrime: plan === 'Prime',
					streak: Number(tags.get('msg-param-months'))
				};
				this.emit(this.onSubGift, channel, tags.get('msg-param-recipient-user-name'), subInfo, userNotice);
			}
		});

		this.onMessage(Whisper, (whisper: Whisper) => {
			this.emit(this.onWhisper, whisper.prefix!.nick, whisper.params.message, whisper);
		});

		this.onMessage(Notice, (notice: Notice) => {
			const {params: {target: channel, message}, tags} = notice;
			const messageType = tags.get('msg-id');

			// this event handler involves a lot of parsing strings you shouldn't parse...
			// but Twitch doesn't give us the required info in tags (╯°□°）╯︵ ┻━┻
			// (this code also might not do the right thing with foreign character display names...)
			switch (messageType) {
				// ban
				case 'already_banned': {
					const match = message.split(' ');
					const user = (match && /^\w+$/.test(match[0])) ? match[0] : undefined;
					this.emit(this._onBanResult, channel, user, messageType);
					break;
				}

				case 'bad_ban_self': {
					this.emit(this._onBanResult, channel, this._userName, messageType);
					break;
				}

				case 'bad_ban_broadcaster': {
					this.emit(this._onBanResult, channel, UserTools.toUserName(channel), messageType);
					break;
				}

				case 'bad_ban_admin':
				case 'bad_ban_global_mod':
				case 'bad_ban_staff': {
					const match = message.match(/^You cannot ban (?:\w+ )+?(\w+)\.$/);
					this.emit(this._onBanResult, channel, match ? match[1].toLowerCase() : undefined, messageType);
					break;
				}

				case 'ban_success': {
					const match = message.split(' ');
					const user = (match && /^\w+$/.test(match[0])) ? match[0] : undefined;
					this.emit(this._onBanResult, channel, user);
					break;
				}

				// unban
				case 'bad_unban_no_ban': {
					const match = message.split(' ');
					const user = (match && /^\w+$/.test(match[0])) ? match[0] : undefined;
					this.emit(this._onUnbanResult, channel, user, messageType);
					break;
				}

				case 'unban_success': {
					const match = message.split(' ');
					const user = (match && /^\w+$/.test(match[0])) ? match[0] : undefined;
					this.emit(this._onUnbanResult, channel, user);
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
					const user = (match && /^\w+$/.test(match[0])) ? match[0] : undefined;
					this.emit(this._onModResult, channel, user, messageType);
					break;
				}

				case 'mod_success': {
					const match = message.match(/^You have added (\w+) /);
					this.emit(this._onModResult, channel, match ? match[1] : undefined);
					break;
				}

				// unmod
				case 'bad_unmod_mod': {
					const match = message.split(' ');
					const user = (match && /^\w+$/.test(match[0])) ? match[0] : undefined;
					this.emit(this._onUnmodResult, channel, user, messageType);
					break;
				}

				case 'unmod_success': {
					const match = message.match(/^You have removed (\w+) /);
					this.emit(this._onUnmodResult, channel, match ? match[1] : undefined);
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
					this.emit(this._onTimeoutResult, channel, this._userName, undefined, undefined, messageType);
					break;
				}

				case 'bad_timeout_broadcaster': {
					this.emit(this._onTimeoutResult, channel, UserTools.toUserName(channel), undefined, undefined, messageType);
					break;
				}

				case 'bad_timeout_admin':
				case 'bad_timeout_global_mod':
				case 'bad_timeout_staff': {
					const match = message.match(/^You cannot ban (?:\w+ )+?(\w+)\.$/);
					this.emit(
						this._onTimeoutResult, channel, match ? match[1].toLowerCase() : undefined,
						undefined, undefined, messageType
					);
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
				case 'slow_off':
				// ...and CLEARCHAT...
				case 'timeout_success':
				// ...and HOSTTARGET
				case 'host_off':
				case 'host_on':
				case 'host_target_went_offline': {
					break;
				}

				case 'unrecognized_cmd': {
					break;
				}

				case null: {
					// this might be one of these weird authentication error notices that don't have a msg-id...
					if (message === 'Login authentication failed'
						|| message === 'Improperly formatted AUTH'
						|| message === 'Invalid NICK') {
						this._connection.disconnect();
					}
					break;
				}

				default: {
					if (!messageType || messageType.substr(0, 6) !== 'usage_') {
						console.warn(`Unrecognized notice ID: '${messageType}'`);
					}
				}
			}
		});
	}

	async host(target: string, channel: string = this._nick) {
		channel = UserTools.toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onHostResult((chan, error) => {
				if (UserTools.toUserName(chan) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			this.sendMessage(TwitchPrivateMessage, {target: UserTools.toChannelName(channel), message: `/host ${target}`});
		});
	}

	async unhost(channel: string = this._nick) {
		channel = UserTools.toUserName(channel);
		return new Promise<void>((resolve, reject) => {
			const e = this._onUnhostResult((chan, error) => {
				if (UserTools.toUserName(chan) === channel) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}
					this.removeListener(e);
				}
			});
			this.sendMessage(TwitchPrivateMessage, {target: UserTools.toChannelName(channel), message: '/unhost'});
		});
	}

	unhostOutside(channel: string = this._nick) {
		this.sendMessage(TwitchPrivateMessage, {target: UserTools.toChannelName(channel), message: '/unhost'});
	}

	protected registerCoreMessageTypes() {
		super.registerCoreMessageTypes();
		this.registerMessageType(TwitchPrivateMessage);
	}
}
