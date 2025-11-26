import { type EventSubChannelChatAnnouncementNotificationEvent } from './EventSubChannelChatAnnouncementNotificationEvent.js';
import { type EventSubChannelChatBitsBadgeTierNotificationEvent } from './EventSubChannelChatBitsBadgeTierNotificationEvent.js';
import { type EventSubChannelChatCharityDonationNotificationEvent } from './EventSubChannelChatCharityDonationNotificationEvent.js';
import { type EventSubChannelChatCommunitySubGiftNotificationEvent } from './EventSubChannelChatCommunitySubGiftNotificationEvent.js';
import { type EventSubChannelChatGiftPaidUpgradeNotificationEvent } from './EventSubChannelChatGiftPaidUpgradeNotificationEvent.js';
import { type EventSubChannelChatPayItForwardNotificationEvent } from './EventSubChannelChatPayItForwardNotificationEvent.js';
import { type EventSubChannelChatPrimePaidUpgradeNotificationEvent } from './EventSubChannelChatPrimePaidUpgradeNotificationEvent.js';
import { type EventSubChannelChatRaidNotificationEvent } from './EventSubChannelChatRaidNotificationEvent.js';
import { type EventSubChannelChatResubNotificationEvent } from './EventSubChannelChatResubNotificationEvent.js';
import { type EventSubChannelChatSubGiftNotificationEvent } from './EventSubChannelChatSubGiftNotificationEvent.js';
import { type EventSubChannelChatSubNotificationEvent } from './EventSubChannelChatSubNotificationEvent.js';
import { type EventSubChannelChatUnraidNotificationEvent } from './EventSubChannelChatUnraidNotificationEvent.js';
import { type EventSubChannelChatSharedChatPayItForwardNotificationEvent } from './EventSubChannelChatSharedChatPayItForwardNotificationEvent.js';
import { type EventSubChannelChatSharedChatSubNotificationEvent } from './EventSubChannelChatSharedChatSubNotificationEvent.js';
import { type EventSubChannelChatSharedChatResubNotificationEvent } from './EventSubChannelChatSharedChatResubNotificationEvent.js';
import { type EventSubChannelChatSharedChatSubGiftNotificationEvent } from './EventSubChannelChatSharedChatSubGiftNotificationEvent.js';
import { type EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent } from './EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent.js';
import { type EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent } from './EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent.js';
import { type EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent } from './EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent.js';
import { type EventSubChannelChatSharedChatRaidNotificationEvent } from './EventSubChannelChatSharedChatRaidNotificationEvent.js';
import { type EventSubChannelChatSharedChatAnnouncementNotificationEvent } from './EventSubChannelChatSharedChatAnnouncementNotificationEvent.js';

export type EventSubChannelChatNotificationEvent =
	| EventSubChannelChatSubNotificationEvent
	| EventSubChannelChatResubNotificationEvent
	| EventSubChannelChatSubGiftNotificationEvent
	| EventSubChannelChatCommunitySubGiftNotificationEvent
	| EventSubChannelChatGiftPaidUpgradeNotificationEvent
	| EventSubChannelChatPrimePaidUpgradeNotificationEvent
	| EventSubChannelChatRaidNotificationEvent
	| EventSubChannelChatUnraidNotificationEvent
	| EventSubChannelChatPayItForwardNotificationEvent
	| EventSubChannelChatAnnouncementNotificationEvent
	| EventSubChannelChatCharityDonationNotificationEvent
	| EventSubChannelChatBitsBadgeTierNotificationEvent
	| EventSubChannelChatSharedChatSubNotificationEvent
	| EventSubChannelChatSharedChatResubNotificationEvent
	| EventSubChannelChatSharedChatSubGiftNotificationEvent
	| EventSubChannelChatSharedChatCommunitySubGiftNotificationEvent
	| EventSubChannelChatSharedChatGiftPaidUpgradeNotificationEvent
	| EventSubChannelChatSharedChatPrimePaidUpgradeNotificationEvent
	| EventSubChannelChatSharedChatPayItForwardNotificationEvent
	| EventSubChannelChatSharedChatRaidNotificationEvent
	| EventSubChannelChatSharedChatAnnouncementNotificationEvent;
