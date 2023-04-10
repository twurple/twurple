/** @private */
export interface HelixCharityCampaignAmountData {
	value: number;
	decimal_places: number;
	currency: string;
}

/** @private */
export interface HelixCharityCampaignData {
	id: string;
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	charity_name: string;
	charity_description: string;
	charity_logo: string;
	charity_website: string;
	current_amount: HelixCharityCampaignAmountData;
	target_amount: HelixCharityCampaignAmountData;
}

/** @private */
export interface HelixCharityCampaignDonationData {
	campaign_id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	amount: HelixCharityCampaignAmountData;
}
