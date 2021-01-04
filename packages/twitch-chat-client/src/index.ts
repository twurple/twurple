/* eslint-disable filenames/match-exported */
import { deprecateClass } from '@d-fischer/shared-utils';

import { ChatClient } from './ChatClient';

/** @deprecated Use the named export `ChatClient` instead. */
const DeprecatedChatClient = deprecateClass(
	ChatClient,
	`[twitch-chat-client] The default export has been deprecated. Use the named export instead:

\timport { ChatClient } from 'twitch-chat-client';`
);
/** @deprecated Use the named export `ChatClient` instead. */
// eslint-disable-next-line @typescript-eslint/no-redeclare
type DeprecatedChatClient = ChatClient;
/** @deprecated Use the named export `ChatClient` instead. */
export default DeprecatedChatClient;
export { ChatClient };

export { TwitchPrivateMessage as PrivateMessage } from './StandardCommands/TwitchPrivateMessage';

export { ClearChat } from './Capabilities/TwitchCommandsCapability/MessageTypes/ClearChat';
export { HostTarget } from './Capabilities/TwitchCommandsCapability/MessageTypes/HostTarget';
export { Reconnect } from './Capabilities/TwitchCommandsCapability/MessageTypes/Reconnect';
export { RoomState } from './Capabilities/TwitchCommandsCapability/MessageTypes/RoomState';
export { UserNotice } from './Capabilities/TwitchCommandsCapability/MessageTypes/UserNotice';
export { UserState } from './Capabilities/TwitchCommandsCapability/MessageTypes/UserState';
export { Whisper } from './Capabilities/TwitchCommandsCapability/MessageTypes/Whisper';

export { ClearMsg } from './Capabilities/TwitchTagsCapability/MessageTypes/ClearMsg';
export { GlobalUserState } from './Capabilities/TwitchTagsCapability/MessageTypes/GlobalUserState';

export type {
	ChatSubGiftInfo,
	ChatSubGiftUpgradeInfo,
	ChatSubUpgradeInfo,
	ChatSubExtendInfo,
	ChatSubInfo
} from './UserNotices/ChatSubInfo';
export type { ChatCommunitySubInfo } from './UserNotices/ChatCommunitySubInfo';
export type { ChatRaidInfo } from './UserNotices/ChatRaidInfo';
export type { ChatRitualInfo } from './UserNotices/ChatRitualInfo';
export type { ChatBitsBadgeUpgradeInfo } from './UserNotices/ChatBitsBadgeUpgradeInfo';

export type { ChatSayMessageAttributes } from './ChatMessageAttributes';

export { ChatUser } from './ChatUser';

export { LogLevel } from '@d-fischer/logger';

export { toChannelName, toUserName } from './Toolkit/UserTools';
export type {
	ParsedMessagePart,
	ParsedMessageEmotePart,
	ParsedMessageCheerPart,
	ParsedMessageTextPart
} from './Toolkit/EmoteTools';
export { parseTwitchMessage } from './Toolkit/MessageTools';
