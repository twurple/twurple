import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';

/** @private */
export interface HelixModeratorData {
	user_id: string;
	user_name: string;
}

/**
 * Information about the moderator status of a user.
 */
export class HelixModerator {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: HelixModeratorData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId() {
		return this._data.user_id;
	}

	/**
	 * Retrieves more data about the user.
	 */
	async getUser() {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	/**
	 * The name of the user.
	 */
	get userName() {
		return this._data.user_name;
	}
}
