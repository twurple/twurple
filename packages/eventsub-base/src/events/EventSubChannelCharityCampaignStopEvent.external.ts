import { type EventSubChannelCharityAmountData } from './common/EventSubChannelCharityAmount.external.js';

/** @private */
export interface EventSubChannelCharityCampaignStopEventData {
	id: string;
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	charity_name: string;
	charity_description: string;
	charity_logo: string;
	charity_website: string;
	current_amount: EventSubChannelCharityAmountData;
	target_amount: EventSubChannelCharityAmountData;
	stopped_at: string;
}
