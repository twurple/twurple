/**
 * The type of the reward.
 */
export type EventSubAutomaticRewardType =
	| 'single_message_bypass_sub_mode'
	| 'send_highlighted_message'
	| 'random_sub_emote_unlock'
	| 'chosen_sub_emote_unlock'
	| 'chosen_modified_sub_emote_unlock'
	| 'message_effect'
	| 'gigantify_an_emote'
	| 'celebration';

/** @private */
export interface EventSubAutomaticRewardRedemptionRewardUnlockedEmoteData {
	id: string;
	name: string;
}

/** @private */
export interface EventSubAutomaticRewardRedemptionRewardData {
	type: EventSubAutomaticRewardType;
	cost: number;
	unlocked_emote: null;
}

/** @private */
export interface EventSubAutomaticRewardRedemptionMessageEmoteData {
	id: string;
	begin: number;
	end: number;
}

/** @private */
export interface EventSubAutomaticRewardRedemptionMessageData {
	text: string;
	emotes: EventSubAutomaticRewardRedemptionMessageEmoteData[];
}

/** @private */
export interface EventSubChannelAutomaticRewardRedemptionAddEventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	broadcaster_user_login: string;
	user_id: string;
	user_name: string;
	user_login: string;
	id: string;
	reward: EventSubAutomaticRewardRedemptionRewardData;
	message: EventSubAutomaticRewardRedemptionMessageData | null;
	user_input: string;
	redeemed_at: string;
}
