import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

/** @private */
export interface HelixModeratorData {
	user_id: string;
	user_name: string;
}

/**
 * Information about the moderator status of a user.
 */
export default class HelixModerator {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixModeratorData, client: TwitchClient) {
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
