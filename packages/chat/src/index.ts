export { ChatClient } from './ChatClient.js';
export type { ChatClientOptions, TwitchBotLevel } from './ChatClient.js';
export type { WebSocketConnectionOptions } from '@d-fischer/connection';

export { ChatMessage } from './commands/ChatMessage.js';

export { ClearChat } from './caps/twitchCommands/messageTypes/ClearChat.js';
export { Reconnect } from './caps/twitchCommands/messageTypes/Reconnect.js';
export { RoomState } from './caps/twitchCommands/messageTypes/RoomState.js';
export { UserNotice } from './caps/twitchCommands/messageTypes/UserNotice.js';
export { UserState } from './caps/twitchCommands/messageTypes/UserState.js';
export { Whisper } from './caps/twitchCommands/messageTypes/Whisper.js';

export { ClearMsg } from './caps/twitchTags/messageTypes/ClearMsg.js';
export { GlobalUserState } from './caps/twitchTags/messageTypes/GlobalUserState.js';

export type { ChatAnnouncementInfo } from './userNotices/ChatAnnouncementInfo.js';
export type { ChatBitsBadgeUpgradeInfo } from './userNotices/ChatBitsBadgeUpgradeInfo.js';
export type { ChatCommunityPayForwardInfo } from './userNotices/ChatCommunityPayForwardInfo.js';
export type { ChatCommunitySubInfo } from './userNotices/ChatCommunitySubInfo.js';
export type { ChatPrimeCommunityGiftInfo } from './userNotices/ChatPrimeCommunityGiftInfo.js';
export type { ChatRaidInfo } from './userNotices/ChatRaidInfo.js';
export type { ChatRewardGiftInfo } from './userNotices/ChatRewardGiftInfo.js';
export type { ChatRitualInfo } from './userNotices/ChatRitualInfo.js';
export type { ChatStandardPayForwardInfo } from './userNotices/ChatStandardPayForwardInfo.js';
export type {
	ChatSubExtendInfo,
	ChatSubGiftInfo,
	ChatSubGiftUpgradeInfo,
	ChatSubInfo,
	ChatSubOriginalGiftInfo,
	ChatSubUpgradeInfo,
} from './userNotices/ChatSubInfo.js';

export { extractMessageId, type ChatSayMessageAttributes } from './ChatMessageAttributes.js';

export { ChatUser } from './ChatUser.js';

export { LogLevel } from '@d-fischer/logger';

export {
	buildEmoteImageUrl,
	type EmoteAnimationSettings,
	type EmoteBackgroundType,
	type EmoteSettings,
	type EmoteSize,
} from './emotes/buildEmoteImageUrl.js';
export {
	findCheermotePositions,
	fillTextPositions,
	parseChatMessage,
	parseEmotePositions,
} from './emotes/messagePartParser.js';
export {
	type ParsedMessagePart,
	type ParsedMessageEmotePart,
	type ParsedMessageCheerPart,
	type ParsedMessageTextPart,
} from './emotes/ParsedMessagePart.js';

export { parseTwitchMessage, extractMessageText } from './utils/messageUtil.js';
export { parseEmoteOffsets } from './utils/emoteUtil.js';
export { toChannelName, toUserName } from './utils/userUtil.js';
