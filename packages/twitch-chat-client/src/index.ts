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

export {
	ChatSubGiftInfo,
	ChatSubGiftUpgradeInfo,
	ChatSubUpgradeInfo,
	ChatSubExtendInfo,
	ChatSubInfo
} from './UserNotices/ChatSubInfo';
export { ChatCommunitySubInfo } from './UserNotices/ChatCommunitySubInfo';
export { ChatRaidInfo } from './UserNotices/ChatRaidInfo';
export { ChatRitualInfo } from './UserNotices/ChatRitualInfo';
export { ChatBitsBadgeUpgradeInfo } from './UserNotices/ChatBitsBadgeUpgradeInfo';

export { ChatUser } from './ChatUser';

export { LogLevel } from '@d-fischer/logger';

export { toChannelName, toUserName } from './Toolkit/UserTools';
export { ParsedMessagePart } from './Toolkit/EmoteTools';
export { ParsedMessageEmotePart } from './Toolkit/EmoteTools';
export { ParsedMessageCheerPart } from './Toolkit/EmoteTools';
export { ParsedMessageTextPart } from './Toolkit/EmoteTools';
