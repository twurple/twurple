/**
 * The tier of a gifted subscription. 1000 means tier 1, and so on.
 */
export type EventSubChannelSubscriptionGiftEventTier = '1000' | '2000' | '3000';

/** @private */
export interface EventSubChannelSubscriptionGiftEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	total: number;
	tier: EventSubChannelSubscriptionGiftEventTier;
	cumulative_total: number | null;
	is_anonymous: boolean;
}
