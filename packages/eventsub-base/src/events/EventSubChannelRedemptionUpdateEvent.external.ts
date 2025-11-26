import { type EventSubChannelRedemptionRewardData } from './common/EventSubChannelRedemptionReward.external.js';

/** @private */
export interface EventSubChannelRedemptionUpdateEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	user_input: string;
	status: 'fulfilled' | 'canceled';
	reward: EventSubChannelRedemptionRewardData;
	redeemed_at: string;
}
