/**
 * The type of the reward.
 */
export type EventSubChannelAutomaticRewardType =
	| 'single_message_bypass_sub_mode'
	| 'send_highlighted_message'
	| 'random_sub_emote_unlock'
	| 'chosen_sub_emote_unlock'
	| 'chosen_modified_sub_emote_unlock';

/**
 * Emote associated with the reward.
 */
export interface EventSubChannelAutomaticRewardEmoteData {
	id: string;
	name: string;
}

/** @private*/
export interface EventSubChannelAutomaticRewardData {
	type: EventSubChannelAutomaticRewardType;
	channel_points: number;
	emote: EventSubChannelAutomaticRewardEmoteData | null;
}
