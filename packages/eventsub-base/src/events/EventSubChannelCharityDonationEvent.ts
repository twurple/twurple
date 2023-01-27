import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelCharityAmount } from './common/EventSubChannelCharityAmount';
import { type EventSubChannelCharityDonationEventData } from './EventSubChannelCharityDonationEvent.external';

/**
 * An EventSub event representing a donation to a charity campaign in a channel.
 */
@rtfm<EventSubChannelCharityDonationEvent>('eventsub-base', 'EventSubChannelCharityDonationEvent', 'broadcasterId')
export class EventSubChannelCharityDonationEvent extends DataObject<EventSubChannelCharityDonationEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelCharityDonationEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * An ID that identifies the charity campaign.
	 */
	get campaignId(): string {
		return this[rawDataSymbol].campaign_id;
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
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The ID of the donating user.
	 */
	get donorId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the donating user.
	 */
	get donorName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the donating user.
	 */
	get donorDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the donating user.
	 */
	async getDonor(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
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
	 * A URL to an image of the charity's logo. The image’s type is PNG and its size is 100px X 100px.
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
	 * An object that contains the amount of money that the user donated.
	 */
	get amount(): EventSubChannelCharityAmount {
		return new EventSubChannelCharityAmount(this[rawDataSymbol].amount);
	}
}
