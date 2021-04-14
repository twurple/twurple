import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/** @private */
export interface HelixModeratorData {
	user_id: string;
	user_login: string;
	user_name: string;
}

/**
 * Information about the moderator status of a user.
 */
@rtfm<HelixModerator>('api', 'HelixModerator', 'userId')
export class HelixModerator {
	@Enumerable(false) private readonly _data: HelixModeratorData;
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixModeratorData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}
}
