import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../client/BaseApiClient';
import type { HelixUser } from '../endpoints/user/HelixUser';
import { type HelixUserRelationData } from '../interfaces/endpoints/generic.external';

/**
 * A relation of anything with a user.
 */
@rtfm<HelixUserRelation>('api', 'HelixUserRelation', 'id')
export class HelixUserRelation extends DataObject<HelixUserRelationData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixUserRelationData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get id(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user.
	 */
	get name(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user.
	 */
	get displayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets additional information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}
}
