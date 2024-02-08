import { type EventSubChannelChatAnnouncementNotificationEvent } from './EventSubChannelChatAnnouncementNotificationEvent';
import { type EventSubChannelChatBitsBadgeTierNotificationEvent } from './EventSubChannelChatBitsBadgeTierNotificationEvent';
import { type EventSubChannelChatCharityDonationNotificationEvent } from './EventSubChannelChatCharityDonationNotificationEvent';
import { type EventSubChannelChatCommunitySubGiftNotificationEvent } from './EventSubChannelChatCommunitySubGiftNotificationEvent';
import { type EventSubChannelChatGiftPaidUpgradeNotificationEvent } from './EventSubChannelChatGiftPaidUpgradeNotificationEvent';
import { type EventSubChannelChatPayItForwardNotificationEvent } from './EventSubChannelChatPayItForwardNotificationEvent';
import { type EventSubChannelChatPrimePaidUpgradeNotificationEvent } from './EventSubChannelChatPrimePaidUpgradeNotificationEvent';
import { type EventSubChannelChatRaidNotificationEvent } from './EventSubChannelChatRaidNotificationEvent';
import { type EventSubChannelChatResubNotificationEvent } from './EventSubChannelChatResubNotificationEvent';
import { type EventSubChannelChatSubGiftNotificationEvent } from './EventSubChannelChatSubGiftNotificationEvent';
import { type EventSubChannelChatSubNotificationEvent } from './EventSubChannelChatSubNotificationEvent';
import { type EventSubChannelChatUnraidNotificationEvent } from './EventSubChannelChatUnraidNotificationEvent';

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
	| EventSubChannelChatBitsBadgeTierNotificationEvent;
