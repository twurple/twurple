import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/** @private */
export interface HelixUserBlockData {
	user_id: string;
	user_login: string;
	display_name: string;
}

/**
 * An user blocked by a previously given user.
 */
@rtfm<HelixUserBlock>('twitch', 'HelixUserBlock', 'userId')
export class HelixUserBlock {
	@Enumerable(false) private readonly _data: HelixUserBlockData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixUserBlockData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the blocked user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the blocked user.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the blocked user.
	 */
	get userDisplayName(): string {
		return this._data.display_name;
	}

	/**
	 * Retrieves additional information about the blocked user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}
}
