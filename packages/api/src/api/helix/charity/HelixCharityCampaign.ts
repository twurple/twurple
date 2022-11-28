import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';
import { HelixCharityCampaignAmount, type HelixCharityCampaignAmountData } from './HelixCharityCampaignAmount';

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

/**
 * A charity campaign in a Twitch channel.
 *
 * @beta
 */
@rtfm<HelixCharityCampaign>('api', 'HelixCharityCampaign', 'id')
export class HelixCharityCampaign extends DataObject<HelixCharityCampaignData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixCharityCampaignData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * An ID that identifies the charity campaign.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
	}

	/**
	 * The name of the charity.
	 */
	get charityName(): string {
		return this[rawDataSymbol].charity_name;
	}

	/**
	 * A description of the charity.
	 */
	get charityDescription(): string {
		return this[rawDataSymbol].charity_description;
	}

	/**
	 * A URL to an image of the of the charity;s logo. The image’s type is PNG and its size is 100px X 100px.
	 */
	get charityLogo(): string {
		return this[rawDataSymbol].charity_logo;
	}

	/**
	 * A URL to the charity’s website.
	 */
	get charityWebsite(): string {
		return this[rawDataSymbol].charity_website;
	}

	/**
	 * An object that contains the current amount of donations that the campaign has received.
	 */
	get currentAmount(): HelixCharityCampaignAmount {
		return new HelixCharityCampaignAmount(this[rawDataSymbol].current_amount);
	}

	/**
	 * An object that contains the campaign’s target fundraising goal.
	 */
	get targetAmount(): HelixCharityCampaignAmount {
		return new HelixCharityCampaignAmount(this[rawDataSymbol].target_amount);
	}
}
