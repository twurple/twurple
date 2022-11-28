import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelCharityAmountData } from './common/EventSubChannelCharityAmount';
import { EventSubChannelCharityAmount } from './common/EventSubChannelCharityAmount';

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

/**
 * An EventSub event representing the end of a charity campaign in a channel.
 *
 * @beta
 */
@rtfm<EventSubChannelCharityCampaignStopEvent>('eventsub-base', 'EventSubChannelCharityCampaignStopEvent', 'id')
export class EventSubChannelCharityCampaignStopEvent extends DataObject<EventSubChannelCharityCampaignStopEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelCharityCampaignStopEventData, client: ApiClient) {
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
	 * An object that contains the final amount of donations that the campaign has received.
	 */
	get currentAmount(): EventSubChannelCharityAmount {
		return new EventSubChannelCharityAmount(this[rawDataSymbol].current_amount);
	}

	/**
	 * An object that contains the campaign’s target fundraising goal.
	 */
	get targetAmount(): EventSubChannelCharityAmount {
		return new EventSubChannelCharityAmount(this[rawDataSymbol].target_amount);
	}

	/**
	 * The date/time when the charity campaign ended.
	 */
	get endDate(): Date {
		return new Date(this[rawDataSymbol].stopped_at);
	}
}
