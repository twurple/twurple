import { type EventSubChannelCharityAmountData } from '../common/EventSubChannelCharityAmount.external';
import { type EventSubChatBadge, type EventSubChatMessageData } from '../common/EventSubChatMessage.external';

export type EventSubChannelChatNotificationType =
	| 'sub'
	| 'resub'
	| 'sub_gift'
	| 'community_sub_gift'
	| 'gift_paid_upgrade'
	| 'prime_paid_upgrade'
	| 'raid'
	| 'unraid'
	| 'pay_it_forward'
	| 'announcement'
	| 'charity_donation'
	| 'bits_badge_tier';

/**
 * The tier of a subscription. 1000 means tier 1, and so on.
 */
export type EventSubChannelChatNotificationSubTier = '1000' | '2000' | '3000';

/** @private */
export interface EventSubChannelChatNotificationOriginalGifterData {
	gifter_is_anonymous: boolean;
	gifter_user_id: string | null;
	gifter_user_name: string | null;
	gifter_user_login: string | null;
}

/** @private */
export interface EventSubChannelChatBaseNotificationEventData {
	notice_type: EventSubChannelChatNotificationType;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	chatter_user_id: string;
	chatter_user_login: string;
	chatter_user_name: string;
	chatter_is_anonymous: boolean;
	color: string;
	badges: EventSubChatBadge[];
	system_message: string;
	message_id: string;
	message: EventSubChatMessageData;
}

/** @private */
export interface EventSubChannelChatSubNotificationPayload {
	sub_tier: EventSubChannelChatNotificationSubTier;
	is_prime: boolean;
	duration_months: number;
}

/** @private */
export interface EventSubChannelChatSubNotificationEventData extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'sub';
	sub: EventSubChannelChatSubNotificationPayload;
}

interface EventSubChannelChatResubNotificationPayload {
	sub_tier: EventSubChannelChatNotificationSubTier;
	is_prime: boolean;
	cumulative_months: number;
	duration_months: number;
	streak_months: number | null;
	is_gift: boolean;
	gifter_is_anonymous: boolean | null;
	gifter_user_id: string | null;
	gifter_user_login: string | null;
	gifter_user_name: string | null;
}

/** @private */
export interface EventSubChannelChatResubNotificationEventData extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'resub';
	resub: EventSubChannelChatResubNotificationPayload;
}

/** @private */
export interface EventSubChannelChatSubGiftNotificationPayload {
	duration_months: number;
	cumulative_total: number | null;
	recipient_user_id: string;
	recipient_user_login: string;
	recipient_user_name: string;
	sub_tier: EventSubChannelChatNotificationSubTier;
	community_gift_id: string | null;
}

/** @private */
export interface EventSubChannelChatSubGiftNotificationEventData extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'sub_gift';
	sub_gift: EventSubChannelChatSubGiftNotificationPayload;
}

/** @private */
export interface EventSubChannelChatCommunitySubGiftNotificationPayload {
	id: string;
	total: number;
	sub_tier: EventSubChannelChatNotificationSubTier;
	cumulative_total: number | null;
}

/** @private */
export interface EventSubChannelChatCommunitySubGiftNotificationEventData
	extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'community_sub_gift';
	community_sub_gift: EventSubChannelChatCommunitySubGiftNotificationPayload;
}

/** @private */
export interface EventSubChannelChatGiftPaidUpgradeNotificationEventData
	extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'gift_paid_upgrade';
	gift_paid_upgrade: EventSubChannelChatNotificationOriginalGifterData;
}

/** @private */
export interface EventSubChannelChatPrimePaidUpgradeNotificationPayload {
	sub_tier: EventSubChannelChatNotificationSubTier;
}

/** @private */
export interface EventSubChannelChatPrimePaidUpgradeNotificationEventData
	extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'prime_paid_upgrade';
	prime_paid_upgrade: EventSubChannelChatPrimePaidUpgradeNotificationPayload;
}

/** @private */
interface EventSubChannelChatRaidNotificationPayload {
	user_id: string;
	user_name: string;
	user_login: string;
	viewer_count: number;
	profile_image_url: string;
}

/** @private */
export interface EventSubChannelChatRaidNotificationEventData extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'raid';
	raid: EventSubChannelChatRaidNotificationPayload;
}

/** @private */
export interface EventSubChannelChatUnraidNotificationEventData extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'unraid';
	unraid: Record<never, never>;
}

/** @private */
export interface EventSubChannelChatPayItForwardNotificationEventData
	extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'pay_it_forward';
	pay_it_forward: EventSubChannelChatNotificationOriginalGifterData;
}

/**
 * The colors that can be used for annoucements.
 */
export type EventSubChannelChatAnnouncementColor = 'blue' | 'green' | 'orange' | 'purple' | 'primary';

/** @private */
export interface EventSubChannelChatAnnouncementNotificationPayload {
	color: EventSubChannelChatAnnouncementColor;
}

/** @private */
export interface EventSubChannelChatAnnouncementNotificationEventData
	extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'announcement';
	announcement: EventSubChannelChatAnnouncementNotificationPayload;
}

/** @private */
export interface EventSubChannelChatCharityDonationNotificationPayload {
	charity_name: string;
	amount: EventSubChannelCharityAmountData;
}

/** @private */
export interface EventSubChannelChatCharityDonationNotificationEventData
	extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'charity_donation';
	charity_donation: EventSubChannelChatCharityDonationNotificationPayload;
}

/** @private */
export interface EventSubChannelChatBitsBadgeTierNotificationPayload {
	tier: number;
}

/** @private */
export interface EventSubChannelChatBitsBadgeTierNotificationEventData
	extends EventSubChannelChatBaseNotificationEventData {
	notice_type: 'bits_badge_tier';
	bits_badge_tier: EventSubChannelChatBitsBadgeTierNotificationPayload;
}

/** @private */
export type EventSubChannelChatNotificationEventData =
	| EventSubChannelChatSubNotificationEventData
	| EventSubChannelChatResubNotificationEventData
	| EventSubChannelChatSubGiftNotificationEventData
	| EventSubChannelChatCommunitySubGiftNotificationEventData
	| EventSubChannelChatGiftPaidUpgradeNotificationEventData
	| EventSubChannelChatPrimePaidUpgradeNotificationEventData
	| EventSubChannelChatRaidNotificationEventData
	| EventSubChannelChatUnraidNotificationEventData
	| EventSubChannelChatPayItForwardNotificationEventData
	| EventSubChannelChatAnnouncementNotificationEventData
	| EventSubChannelChatCharityDonationNotificationEventData
	| EventSubChannelChatBitsBadgeTierNotificationEventData;
