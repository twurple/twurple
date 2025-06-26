import { type EventSubChannelAutomaticRewardData } from './common/EventSubChannelAutomaticReward.external';

/** @private */
export interface EventSubChatAutomaticRewardRedemptionMessageTextPart {
	type: 'text';
	text: string;
}

/** @private */
export interface EventSubChatAutomaticRewardRedemptionMessageEmoteData {
	id: string;
}

/** @private */
export interface EventSubChatAutomaticRewardRedemptionMessageEmotePart {
	type: 'emote';
	text: string;
	emote: EventSubChatAutomaticRewardRedemptionMessageEmoteData;
}

/** @private */
export type EventSubAutomaticRewardRedemptionMessagePart =
	| EventSubChatAutomaticRewardRedemptionMessageTextPart
	| EventSubChatAutomaticRewardRedemptionMessageEmotePart;

/** @private */
export interface EventSubChatAutomaticRewardRedemptionMessageData {
	text: string;
	fragments: EventSubAutomaticRewardRedemptionMessagePart[];
}

/** @private */
export interface EventSubChannelAutomaticRewardRedemptionAddV2EventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	broadcaster_user_login: string;
	user_id: string;
	user_name: string;
	user_login: string;
	id: string;
	reward: EventSubChannelAutomaticRewardData;
	message: EventSubChatAutomaticRewardRedemptionMessageData | null;
	redeemed_at: string;
}
