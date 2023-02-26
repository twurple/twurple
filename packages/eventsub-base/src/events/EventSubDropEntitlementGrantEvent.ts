import { Enumerable } from '@d-fischer/shared-utils';
import { type ApiClient, type HelixGame, type HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubDropEntitlementGrantEventData } from './EventSubDropEntitlementGrantEvent.external';

/**
 * An EventSub event representing a drop entitlement grant.
 */
@rtfm<EventSubDropEntitlementGrantEvent>('eventsub-base', 'EventSubDropEntitlementGrantEvent', 'entitlementId')
export class EventSubDropEntitlementGrantEvent extends DataObject<EventSubDropEntitlementGrantEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubDropEntitlementGrantEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the organization.
	 */
	get organizationId(): string {
		return this[rawDataSymbol].organization_id;
	}

	/**
	 * The ID of the category/game.
	 */
	get categoryId(): string {
		return this[rawDataSymbol].category_id;
	}

	/**
	 * The name of the category/game.
	 */
	get categoryName(): string {
		return this[rawDataSymbol].category_name;
	}

	/**
	 * Gets more information about the category/game.
	 */
	async getCategory(): Promise<HelixGame> {
		return checkRelationAssertion(await this._client.games.getGameById(this[rawDataSymbol].category_id));
	}

	/**
	 * The ID of the campaign.
	 */
	get campaignId(): string {
		return this[rawDataSymbol].campaign_id;
	}

	/**
	 * The ID of the entitled user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the entitled user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the entitled user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the entitled user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The ID of the entitlement.
	 */
	get entitlementId(): string {
		return this[rawDataSymbol].entitlement_id;
	}

	/**
	 * The ID of the reward.
	 */
	get rewardId(): string {
		return this[rawDataSymbol].benefit_id;
	}

	/**
	 * The date when the entitlement was granted.
	 */
	get grantDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}
}
