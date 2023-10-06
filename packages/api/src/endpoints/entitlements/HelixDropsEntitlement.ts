import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import {
	type HelixDropsEntitlementData,
	type HelixDropsEntitlementFulfillmentStatus,
} from '../../interfaces/endpoints/entitlement.external';
import { type HelixGame } from '../game/HelixGame';
import { type HelixUser } from '../user/HelixUser';

/**
 * An entitlement for a drop.
 */
@rtfm('api', 'HelixDropsEntitlement')
export class HelixDropsEntitlement extends DataObject<HelixDropsEntitlementData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixDropsEntitlementData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the entitlement.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
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
		return new Date(this[rawDataSymbol].timestamp);
	}

	/**
	 * The ID of the entitled user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * Gets more information about the entitled user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The ID of the game the entitlement was granted for.
	 */
	get gameId(): string {
		return this[rawDataSymbol].game_id;
	}

	/**
	 * Gets more information about the game the entitlement was granted for.
	 */
	async getGame(): Promise<HelixGame> {
		return checkRelationAssertion(await this._client.games.getGameById(this[rawDataSymbol].game_id));
	}

	/**
	 * The fulfillment status of the entitlement.
	 */
	get fulfillmentStatus(): HelixDropsEntitlementFulfillmentStatus {
		return this[rawDataSymbol].fulfillment_status;
	}

	/**
	 * The date when the entitlement was last updated.
	 */
	get updateDate(): Date {
		return new Date(this[rawDataSymbol].last_updated);
	}
}
