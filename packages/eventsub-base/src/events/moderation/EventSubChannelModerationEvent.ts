import { type EventSubChannelAutoModTermsModerationEvent } from './EventSubChannelAutoModTermsModerationEvent.js';
import { type EventSubChannelBanModerationEvent } from './EventSubChannelBanModerationEvent.js';
import { type EventSubChannelClearModerationEvent } from './EventSubChannelClearModerationEvent.js';
import { type EventSubChannelDeleteModerationEvent } from './EventSubChannelDeleteModerationEvent.js';
import { type EventSubChannelEmoteOnlyModerationEvent } from './EventSubChannelEmoteOnlyModerationEvent.js';
import { type EventSubChannelEmoteOnlyOffModerationEvent } from './EventSubChannelEmoteOnlyOffModerationEvent.js';
import { type EventSubChannelFollowersModerationEvent } from './EventSubChannelFollowersModerationEvent.js';
import { type EventSubChannelFollowersOffModerationEvent } from './EventSubChannelFollowersOffModerationEvent.js';
import { type EventSubChannelModModerationEvent } from './EventSubChannelModModerationEvent.js';
import { type EventSubChannelRaidModerationEvent } from './EventSubChannelRaidModerationEvent.js';
import { type EventSubChannelSlowModerationEvent } from './EventSubChannelSlowModerationEvent.js';
import { type EventSubChannelSlowOffModerationEvent } from './EventSubChannelSlowOffModerationEvent.js';
import { type EventSubChannelSubscribersModerationEvent } from './EventSubChannelSubscribersModerationEvent.js';
import { type EventSubChannelSubscribersOffModerationEvent } from './EventSubChannelSubscribersOffModerationEvent.js';
import { type EventSubChannelTimeoutModerationEvent } from './EventSubChannelTimeoutModerationEvent.js';
import { type EventSubChannelUnbanModerationEvent } from './EventSubChannelUnbanModerationEvent.js';
import { type EventSubChannelUnbanRequestModerationEvent } from './EventSubChannelUnbanRequestModerationEvent.js';
import { type EventSubChannelUniqueChatModerationEvent } from './EventSubChannelUniqueChatModerationEvent.js';
import { type EventSubChannelUniqueChatOffModerationEvent } from './EventSubChannelUniqueChatOffModerationEvent.js';
import { type EventSubChannelUnmodModerationEvent } from './EventSubChannelUnmodModerationEvent.js';
import { type EventSubChannelUnraidModerationEvent } from './EventSubChannelUnraidModerationEvent.js';
import { type EventSubChannelUntimeoutModerationEvent } from './EventSubChannelUntimeoutModerationEvent.js';
import { type EventSubChannelUnvipModerationEvent } from './EventSubChannelUnvipModerationEvent.js';
import { type EventSubChannelVipModerationEvent } from './EventSubChannelVipModerationEvent.js';
import { type EventSubChannelWarnModerationEvent } from './EventSubChannelWarnModerationEvent.js';
import { type EventSubChannelSharedChatBanModerationEvent } from './EventSubChannelSharedChatBanModerationEvent.js';
import { type EventSubChannelSharedChatTimeoutModerationEvent } from './EventSubChannelSharedChatTimeoutModerationEvent.js';
import { type EventSubChannelSharedChatUnbanModerationEvent } from './EventSubChannelSharedChatUnbanModerationEvent.js';
import { type EventSubChannelSharedChatUntimeoutModerationEvent } from './EventSubChannelSharedChatUntimeoutModerationEvent.js';
import { type EventSubChannelSharedChatDeleteModerationEvent } from './EventSubChannelSharedChatDeleteModerationEvent.js';

export type EventSubChannelModerationEvent =
	| EventSubChannelAutoModTermsModerationEvent
	| EventSubChannelBanModerationEvent
	| EventSubChannelClearModerationEvent
	| EventSubChannelDeleteModerationEvent
	| EventSubChannelEmoteOnlyModerationEvent
	| EventSubChannelEmoteOnlyOffModerationEvent
	| EventSubChannelFollowersModerationEvent
	| EventSubChannelFollowersOffModerationEvent
	| EventSubChannelModModerationEvent
	| EventSubChannelRaidModerationEvent
	| EventSubChannelSlowModerationEvent
	| EventSubChannelSlowOffModerationEvent
	| EventSubChannelSubscribersModerationEvent
	| EventSubChannelSubscribersOffModerationEvent
	| EventSubChannelTimeoutModerationEvent
	| EventSubChannelUnbanModerationEvent
	| EventSubChannelUnbanRequestModerationEvent
	| EventSubChannelUniqueChatModerationEvent
	| EventSubChannelUniqueChatOffModerationEvent
	| EventSubChannelUnmodModerationEvent
	| EventSubChannelUnraidModerationEvent
	| EventSubChannelUntimeoutModerationEvent
	| EventSubChannelUnvipModerationEvent
	| EventSubChannelVipModerationEvent
	| EventSubChannelWarnModerationEvent
	| EventSubChannelSharedChatBanModerationEvent
	| EventSubChannelSharedChatUnbanModerationEvent
	| EventSubChannelSharedChatTimeoutModerationEvent
	| EventSubChannelSharedChatUntimeoutModerationEvent
	| EventSubChannelSharedChatDeleteModerationEvent;
