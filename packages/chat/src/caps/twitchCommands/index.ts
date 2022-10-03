import type { Capability } from 'ircv3';
import { ClearChat } from './messageTypes/ClearChat';
import { Reconnect } from './messageTypes/Reconnect';
import { RoomState } from './messageTypes/RoomState';
import { UserNotice } from './messageTypes/UserNotice';
import { UserState } from './messageTypes/UserState';
import { Whisper } from './messageTypes/Whisper';

/** @private */
export const TwitchCommandsCapability: Capability = {
	name: 'twitch.tv/commands',
	messageTypes: [ClearChat, Reconnect, RoomState, UserNotice, UserState, Whisper]
};
