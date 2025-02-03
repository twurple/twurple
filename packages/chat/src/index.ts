export { ChatClient } from './ChatClient';
export type { ChatClientOptions, TwitchBotLevel } from './ChatClient';
export type { WebSocketConnectionOptions } from '@d-fischer/connection';

export { ChatMessage } from './commands/ChatMessage';

export { ClearChat } from './caps/twitchCommands/messageTypes/ClearChat';
export { Reconnect } from './caps/twitchCommands/messageTypes/Reconnect';
export { RoomState } from './caps/twitchCommands/messageTypes/RoomState';
export { UserNotice } from './caps/twitchCommands/messageTypes/UserNotice';
export { UserState } from './caps/twitchCommands/messageTypes/UserState';
export { Whisper } from './caps/twitchCommands/messageTypes/Whisper';

export { ClearMsg } from './caps/twitchTags/messageTypes/ClearMsg';
export { GlobalUserState } from './caps/twitchTags/messageTypes/GlobalUserState';

export type { ChatAnnouncementInfo } from './userNotices/ChatAnnouncementInfo';
export type { ChatBitsBadgeUpgradeInfo } from './userNotices/ChatBitsBadgeUpgradeInfo';
export type { ChatCommunityPayForwardInfo } from './userNotices/ChatCommunityPayForwardInfo';
export type { ChatCommunitySubInfo } from './userNotices/ChatCommunitySubInfo';
export type { ChatPrimeCommunityGiftInfo } from './userNotices/ChatPrimeCommunityGiftInfo';
export type { ChatRaidInfo } from './userNotices/ChatRaidInfo';
export type { ChatRewardGiftInfo } from './userNotices/ChatRewardGiftInfo';
export type { ChatRitualInfo } from './userNotices/ChatRitualInfo';
export type { ChatStandardPayForwardInfo } from './userNotices/ChatStandardPayForwardInfo';
export type { ChatViewerMilestoneInfo } from './userNotices/ChatViewerMilestoneInfo';
export type {
	ChatSubExtendInfo,
	ChatSubGiftInfo,
	ChatSubGiftUpgradeInfo,
	ChatSubInfo,
	ChatSubOriginalGiftInfo,
	ChatSubUpgradeInfo,
} from './userNotices/ChatSubInfo';

export { extractMessageId, type ChatSayMessageAttributes } from './ChatMessageAttributes';

export { ChatUser } from './ChatUser';

export { LogLevel } from '@d-fischer/logger';

export {
	buildEmoteImageUrl,
	type EmoteAnimationSettings,
	type EmoteBackgroundType,
	type EmoteSettings,
	type EmoteSize,
} from './emotes/buildEmoteImageUrl';
export {
	findCheermotePositions,
	fillTextPositions,
	parseChatMessage,
	parseEmotePositions,
} from './emotes/messagePartParser';
export {
	type ParsedMessagePart,
	type ParsedMessageEmotePart,
	type ParsedMessageCheerPart,
	type ParsedMessageTextPart,
} from './emotes/ParsedMessagePart';

export { parseTwitchMessage, extractMessageText } from './utils/messageUtil';
export { parseEmoteOffsets } from './utils/emoteUtil';
export { toChannelName, toUserName } from './utils/userUtil';
