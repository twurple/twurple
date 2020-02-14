import { NonEnumerable } from '@d-fischer/shared-utils';
import { UserIdResolvable } from '../../../Toolkit/UserTools';
import TwitchClient from '../../../TwitchClient';

/**
 * Filters for the follower request.
 */
export interface HelixFollowFilter {
	/**
	 * The following user.
	 */
	user?: UserIdResolvable;

	/**
	 * The followed user.
	 */
	followedUser?: UserIdResolvable;
}

/** @private */
export interface HelixFollowData {
	from_id: string;
	from_name: string;
	to_id: string;
	to_name: string;
	followed_at: string;
}

/**
 * A relation of a user following a broadcaster.
 */
export default class HelixFollow {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(/** @private */ protected _data: HelixFollowData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The user ID of the following user.
	 */
	get userId() {
		return this._data.from_id;
	}

	/**
	 * The display name of the following user.
	 */
	get userDisplayName() {
		return this._data.from_name;
	}

	/**
	 * Retrieves the data of the following user.
	 */
	async getUser() {
		return this._client.helix.users.getUserById(this._data.from_id);
	}

	/**
	 * The user ID of the followed broadcaster.
	 */
	get followedUserId() {
		return this._data.to_id;
	}

	/**
	 * The display name of the followed user.
	 */
	get followedUserDisplayName() {
		return this._data.to_name;
	}

	/**
	 * Retrieves the data of the followed broadcaster.
	 */
	async getFollowedUser() {
		return this._client.helix.users.getUserById(this._data.to_id);
	}

	/**
	 * The date when the user followed the broadcaster.
	 */
	get followDate() {
		return new Date(this._data.followed_at);
	}
}
