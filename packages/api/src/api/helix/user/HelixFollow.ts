import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixFollowData } from '../../../interfaces/helix/user.external';
import type { HelixUser } from './HelixUser';

/**
 * A relation of a user following a broadcaster.
 */
@rtfm('api', 'HelixFollow')
export class HelixFollow extends DataObject<HelixFollowData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixFollowData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The user ID of the following user.
	 */
	get userId(): string {
		return this[rawDataSymbol].from_id;
	}

	/**
	 * The name of the following user.
	 */
	get userName(): string {
		return this[rawDataSymbol].from_login;
	}

	/**
	 * The display name of the following user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].from_name;
	}

	/**
	 * Retrieves the data of the following user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].from_id))!;
	}

	/**
	 * The user ID of the followed broadcaster.
	 */
	get followedUserId(): string {
		return this[rawDataSymbol].to_id;
	}

	/**
	 * The name of the followed user.
	 */
	get followedUserName(): string {
		return this[rawDataSymbol].to_login;
	}

	/**
	 * The display name of the followed user.
	 */
	get followedUserDisplayName(): string {
		return this[rawDataSymbol].to_name;
	}

	/**
	 * Retrieves the data of the followed broadcaster.
	 */
	async getFollowedUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].to_id))!;
	}

	/**
	 * The date when the user followed the broadcaster.
	 */
	get followDate(): Date {
		return new Date(this[rawDataSymbol].followed_at);
	}
}
