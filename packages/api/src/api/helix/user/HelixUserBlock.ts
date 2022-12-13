import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixUserBlockData } from '../../../interfaces/helix/user.external';
import type { HelixUser } from './/HelixUser';

/**
 * An user blocked by a previously given user.
 */
@rtfm<HelixUserBlock>('api', 'HelixUserBlock', 'userId')
export class HelixUserBlock extends DataObject<HelixUserBlockData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixUserBlockData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the blocked user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the blocked user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the blocked user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].display_name;
	}

	/**
	 * Retrieves additional information about the blocked user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
