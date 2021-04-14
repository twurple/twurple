import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/** @private */
export interface HelixUserRelationData {
	user_id: string;
	user_login: string;
	user_name: string;
}

/**
 * A relation of anything with a user.
 */
@rtfm<HelixUserRelation>('api', 'HelixUserRelation', 'id')
export class HelixUserRelation {
	@Enumerable(false) private readonly _data: HelixUserRelationData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixUserRelationData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get id(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the user.
	 */
	get name(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the user.
	 */
	get displayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves additional information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}
}
