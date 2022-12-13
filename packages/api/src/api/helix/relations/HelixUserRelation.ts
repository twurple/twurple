import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixUserRelationData } from '../../../interfaces/helix/generic.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * A relation of anything with a user.
 */
@rtfm<HelixUserRelation>('api', 'HelixUserRelation', 'id')
export class HelixUserRelation extends DataObject<HelixUserRelationData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixUserRelationData, client: ApiClient) {
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
	 * Retrieves additional information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
