import { Capability } from 'ircv3';
import ClearChat from './MessageTypes/ClearChat';
import HostTarget from './MessageTypes/HostTarget';
import Reconnect from './MessageTypes/Reconnect';
import RoomState from './MessageTypes/RoomState';
import UserNotice from './MessageTypes/UserNotice';
import UserState from './MessageTypes/UserState';
import Whisper from './MessageTypes/Whisper';

/** @private */
const TwitchCommandsCapability: Capability = {
	name: 'twitch.tv/commands',
	messageTypes: [ClearChat, HostTarget, Reconnect, RoomState, UserNotice, UserState, Whisper]
};

export default TwitchCommandsCapability;
