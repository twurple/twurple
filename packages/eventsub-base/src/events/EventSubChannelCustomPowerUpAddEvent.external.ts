import type { EventSubChannelCustomPowerUpData } from './common/EventSubChannelPowerUpCustomPowerUpData.external.js';

/** @private */
export interface EventSubChannelCustomPowerUpAddEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	user_input: string;
	status: 'unfulfilled' | 'unknown' | 'fulfilled' | 'canceled';
	custom_power_up: EventSubChannelCustomPowerUpData;
	redeemed_at: string;
}
