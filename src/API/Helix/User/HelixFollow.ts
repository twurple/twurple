import { NonEnumerable } from '../../../Toolkit/Decorators';
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
	 * The followed user/channel.
	 */
	followedUser?: UserIdResolvable;
}

/** @private */
export interface HelixFollowData {
	from_id: string;
	to_id: string;
	followed_at: string;
}

/**
 * A relation of a user following another user/channel.
 */
export default class HelixFollow {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(/** @private */ protected _data: HelixFollowData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The date when the user followed the channel.
	 */
	get followDate() {
		return new Date(this._data.followed_at);
	}

	/**
	 * The user ID of the following user.
	 */
	get userId() {
		return this._data.from_id;
	}

	/**
	 * Retrieves the data of the following user.
	 */
	async getUser() {
		return this._client.helix.users.getUserById(this._data.from_id);
	}

	/**
	 * The user ID of the followed user/channel.
	 */
	get followedUserId() {
		return this._data.to_id;
	}

	/**
	 * Retrieves the data of the followed user/channel.
	 */
	async getFollowedUser() {
		return this._client.helix.users.getUserById(this._data.to_id);
	}
}
