import { type EventSubChannelRedemptionRewardData } from './common/EventSubChannelRedemptionReward.external';

/** @private */
export interface EventSubChannelRedemptionAddEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	user_input: string;
	status: 'unfulfilled' | 'unknown' | 'fulfilled' | 'canceled';
	reward: EventSubChannelRedemptionRewardData;
	redeemed_at: string;
}
