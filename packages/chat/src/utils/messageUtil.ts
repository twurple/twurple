import type { Message, MessageConstructor } from 'ircv3';
import { MessageTypes, parseMessage } from 'ircv3';
import { ClearChat } from '../caps/twitchCommands/messageTypes/ClearChat';
import { Reconnect } from '../caps/twitchCommands/messageTypes/Reconnect';
import { RoomState } from '../caps/twitchCommands/messageTypes/RoomState';
import { UserNotice } from '../caps/twitchCommands/messageTypes/UserNotice';
import { UserState } from '../caps/twitchCommands/messageTypes/UserState';
import { Whisper } from '../caps/twitchCommands/messageTypes/Whisper';
import { ClearMsg } from '../caps/twitchTags/messageTypes/ClearMsg';
import { GlobalUserState } from '../caps/twitchTags/messageTypes/GlobalUserState';
import { TwitchPrivateMessage } from '../commands/TwitchPrivateMessage';

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

export function splitOnSpaces(text: string, maxMsgLength: number): string[] {
	if (text.length <= maxMsgLength) return [text];
	text = text.trim();
	const res = [];

	let startIndex = 0;
	let endIndex = maxMsgLength;

	while (startIndex < text.length) {
		let spaceIndex = text.lastIndexOf(' ', endIndex);

		if (spaceIndex === -1 || spaceIndex <= startIndex || text.length - startIndex + 1 <= maxMsgLength) {
			spaceIndex = startIndex + maxMsgLength;
		}

		const textSlice = text.slice(startIndex, spaceIndex).trim();
		if (textSlice.length) {
			res.push(textSlice);
		}

		startIndex = spaceIndex + (text[spaceIndex] === ' ' ? 1 : 0); // to skip the space
		endIndex = startIndex + maxMsgLength;
	}

	return res;
}
