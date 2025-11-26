import type { Capability } from 'ircv3';
import { ClearChat } from './messageTypes/ClearChat.js';
import { Reconnect } from './messageTypes/Reconnect.js';
import { RoomState } from './messageTypes/RoomState.js';
import { UserNotice } from './messageTypes/UserNotice.js';
import { UserState } from './messageTypes/UserState.js';
import { Whisper } from './messageTypes/Whisper.js';

/** @internal */
export const TwitchCommandsCapability: Capability = {
	name: 'twitch.tv/commands',
	messageTypes: [ClearChat, Reconnect, RoomState, UserNotice, UserState, Whisper],
};
