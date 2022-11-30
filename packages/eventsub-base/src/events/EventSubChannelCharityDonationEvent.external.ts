import { type EventSubChannelCharityAmountData } from './common/EventSubChannelCharityAmount.external';

/** @private */
export interface EventSubChannelCharityDonationEventData {
	campaign_id: string;
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	charity_name: string;
	charity_description: string;
	charity_logo: string;
	charity_website: string;
	amount: EventSubChannelCharityAmountData;
}
