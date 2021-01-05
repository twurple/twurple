import type { Message, MessageConstructor } from 'ircv3';
import { MessageTypes, parseMessage } from 'ircv3';
import { ClearChat } from '../Capabilities/TwitchCommandsCapability/MessageTypes/ClearChat';
import { HostTarget } from '../Capabilities/TwitchCommandsCapability/MessageTypes/HostTarget';
import { Reconnect } from '../Capabilities/TwitchCommandsCapability/MessageTypes/Reconnect';
import { RoomState } from '../Capabilities/TwitchCommandsCapability/MessageTypes/RoomState';
import { UserNotice } from '../Capabilities/TwitchCommandsCapability/MessageTypes/UserNotice';
import { UserState } from '../Capabilities/TwitchCommandsCapability/MessageTypes/UserState';
import { Whisper } from '../Capabilities/TwitchCommandsCapability/MessageTypes/Whisper';
import { ClearMsg } from '../Capabilities/TwitchTagsCapability/MessageTypes/ClearMsg';
import { GlobalUserState } from '../Capabilities/TwitchTagsCapability/MessageTypes/GlobalUserState';
import { TwitchPrivateMessage } from '../StandardCommands/TwitchPrivateMessage';

const twitchMessageTypes = new Map<string, MessageConstructor>([
	// standard types used by Twitch
	['PRIVMSG', TwitchPrivateMessage],
	['NOTICE', MessageTypes.Commands.Notice],
	['PING', MessageTypes.Commands.Ping],
	['PONG', MessageTypes.Commands.Pong],
	['JOIN', MessageTypes.Commands.ChannelJoin],
	['PART', MessageTypes.Commands.ChannelPart],
	['NICK', MessageTypes.Commands.NickChange],
	['PASS', MessageTypes.Commands.Password],
	['CAP', MessageTypes.Commands.CapabilityNegotiation],
	['001', MessageTypes.Numerics.Reply001Welcome],
	['002', MessageTypes.Numerics.Reply002YourHost],
	['003', MessageTypes.Numerics.Reply003Created],
	// 004 intentionally left out because not standards-conforming
	['353', MessageTypes.Numerics.Reply353NamesReply],
	['366', MessageTypes.Numerics.Reply366EndOfNames],
	['372', MessageTypes.Numerics.Reply372Motd],
	['375', MessageTypes.Numerics.Reply375MotdStart],
	['376', MessageTypes.Numerics.Reply376EndOfMotd],

	// Twitch extensions
	['HOSTTARGET', HostTarget],
	['CLEARCHAT', ClearChat],
	['USERSTATE', UserState],
	['GLOBALUSERSTATE', GlobalUserState],
	['WHISPER', Whisper],
	['ROOMSTATE', RoomState],
	['RECONNECT', Reconnect],
	['USERNOTICE', UserNotice],
	['CLEARMSG', ClearMsg]
]);

export function parseTwitchMessage(rawLine: string): Message {
	return parseMessage(rawLine, undefined, twitchMessageTypes, true);
}
