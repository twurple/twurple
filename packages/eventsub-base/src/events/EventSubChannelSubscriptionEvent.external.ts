/**
 * The tier of a subscription. 1000 means tier 1, and so on.
 */
export type EventSubChannelSubscriptionEventTier = '1000' | '2000' | '3000';

/** @private */
export interface EventSubChannelSubscriptionEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	tier: EventSubChannelSubscriptionEventTier;
	is_gift: boolean;
}
