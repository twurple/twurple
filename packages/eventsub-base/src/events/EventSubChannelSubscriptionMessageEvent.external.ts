/**
 * The tier of a subscription. 1000 means tier 1, and so on.
 */
export type EventSubChannelSubscriptionMessageEventTier = '1000' | '2000' | '3000';

/** @private */
export interface EventSubChannelSubscriptionMessageEmoteData {
	begin: number;
	end: number;
	id: string;
}

/** @private */
export interface EventSubChannelSubscriptionMessageData {
	text: string;
	emotes: EventSubChannelSubscriptionMessageEmoteData[] | null;
}

/** @private */
export interface EventSubChannelSubscriptionMessageEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	tier: EventSubChannelSubscriptionMessageEventTier;
	message: EventSubChannelSubscriptionMessageData;
	cumulative_months: number;
	streak_months: number | null;
	duration_months: number;
}
