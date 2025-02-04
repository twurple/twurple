import { type EventSubChannelAutoModTermsModerationEvent } from './EventSubChannelAutoModTermsModerationEvent';
import { type EventSubChannelBanModerationEvent } from './EventSubChannelBanModerationEvent';
import { type EventSubChannelClearModerationEvent } from './EventSubChannelClearModerationEvent';
import { type EventSubChannelDeleteModerationEvent } from './EventSubChannelDeleteModerationEvent';
import { type EventSubChannelEmoteOnlyModerationEvent } from './EventSubChannelEmoteOnlyModerationEvent';
import { type EventSubChannelEmoteOnlyOffModerationEvent } from './EventSubChannelEmoteOnlyOffModerationEvent';
import { type EventSubChannelFollowersModerationEvent } from './EventSubChannelFollowersModerationEvent';
import { type EventSubChannelFollowersOffModerationEvent } from './EventSubChannelFollowersOffModerationEvent';
import { type EventSubChannelModModerationEvent } from './EventSubChannelModModerationEvent';
import { type EventSubChannelRaidModerationEvent } from './EventSubChannelRaidModerationEvent';
import { type EventSubChannelSlowModerationEvent } from './EventSubChannelSlowModerationEvent';
import { type EventSubChannelSlowOffModerationEvent } from './EventSubChannelSlowOffModerationEvent';
import { type EventSubChannelSubscribersModerationEvent } from './EventSubChannelSubscribersModerationEvent';
import { type EventSubChannelSubscribersOffModerationEvent } from './EventSubChannelSubscribersOffModerationEvent';
import { type EventSubChannelTimeoutModerationEvent } from './EventSubChannelTimeoutModerationEvent';
import { type EventSubChannelUnbanModerationEvent } from './EventSubChannelUnbanModerationEvent';
import { type EventSubChannelUnbanRequestModerationEvent } from './EventSubChannelUnbanRequestModerationEvent';
import { type EventSubChannelUniqueChatModerationEvent } from './EventSubChannelUniqueChatModerationEvent';
import { type EventSubChannelUniqueChatOffModerationEvent } from './EventSubChannelUniqueChatOffModerationEvent';
import { type EventSubChannelUnmodModerationEvent } from './EventSubChannelUnmodModerationEvent';
import { type EventSubChannelUnraidModerationEvent } from './EventSubChannelUnraidModerationEvent';
import { type EventSubChannelUntimeoutModerationEvent } from './EventSubChannelUntimeoutModerationEvent';
import { type EventSubChannelUnvipModerationEvent } from './EventSubChannelUnvipModerationEvent';
import { type EventSubChannelVipModerationEvent } from './EventSubChannelVipModerationEvent';
import { type EventSubChannelWarnModerationEvent } from './EventSubChannelWarnModerationEvent';
import { type EventSubChannelSharedChatBanModerationEvent } from './EventSubChannelSharedChatBanModerationEvent';
import { type EventSubChannelSharedChatTimeoutModerationEvent } from './EventSubChannelSharedChatTimeoutModerationEvent';
import { type EventSubChannelSharedChatUnbanModerationEvent } from './EventSubChannelSharedChatUnbanModerationEvent';
import { type EventSubChannelSharedChatUntimeoutModerationEvent } from './EventSubChannelSharedChatUntimeoutModerationEvent';
import { type EventSubChannelSharedChatDeleteModerationEvent } from './EventSubChannelSharedChatDeleteModerationEvent';

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
