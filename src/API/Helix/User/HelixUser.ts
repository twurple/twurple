import { NonEnumerable } from '../../../Toolkit/Decorators/NonEnumerable';
import { UserIdResolvable } from '../../../Toolkit/UserTools';
import TwitchClient from '../../../TwitchClient';

/**
 * The type of a broadcaster.
 */
export enum HelixBroadcasterType {
	/**
	 * A Twitch Partner.
	 */
	Partner = 'partner',

	/**
	 * A Twitch Affiliate.
	 */
	Affiliate = 'affiliate',

	/**
	 * A user that's neither a partner nor an affiliate.
	 */
	None = ''
}

/**
 * The type of a user.
 */
export enum HelixUserType {
	/**
	 * A Twitch staff member.
	 */
	Staff = 'staff',

	/**
	 * A Twitch administrator.
	 */
	Admin = 'admin',

	/**
	 * A global moderator.
	 */
	GlobalMod = 'global_mod',

	/**
	 * A user with no special permissions across Twitch.
	 */
	None = ''
}

/** @private */
export interface HelixUserData {
	id: string;
	login: string;
	display_name: string;
	description: string;
	type: HelixUserType;
	broadcaster_type: HelixBroadcasterType;
	profile_image_url: string;
	offline_image_url: string;
	view_count: number;
}

/**
 * A Twitch user/channel.
 */
export default class HelixUser {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(/** @private */ protected _data: HelixUserData, client: TwitchClient) {
		this._client = client;
	}

	/** @private */
	get cacheKey() {
		return this._data.id;
	}

	/**
	 * The ID of the user.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The user name of the user.
	 */
	get name() {
		return this._data.login;
	}

	/**
	 * The display name of the user.
	 */
	get displayName() {
		return this._data.display_name;
	}

	/**
	 * The description of the user.
	 */
	get description() {
		return this._data.description;
	}

	/**
	 * The type of the user.
	 */
	get type() {
		return this._data.type;
	}

	/**
	 * The type of the user.
	 */
	get broadcasterType() {
		return this._data.broadcaster_type;
	}

	/**
	 * The URL to the profile picture of the user.
	 */
	get profilePictureUrl() {
		return this._data.profile_image_url;
	}

	/**
	 * The URL to the offline video placeholder of the user.
	 */
	get offlinePlaceholderUrl() {
		return this._data.offline_image_url;
	}

	/**
	 * The total number of views of the channel.
	 */
	get views() {
		return this._data.view_count;
	}

	/**
	 * Retrieves a list of channels the user follows.
	 */
	getFollows() {
		return this._client.helix.users.getFollows({ user: this });
	}

	/**
	 * Retrieves the follow data of the user to the given channel.
	 *
	 * @param channel
	 */
	async getFollowTo(channel: UserIdResolvable) {
		const params = {
			user: this.id,
			followedUser: channel
		};

		const req = this._client.helix.users.getFollows(params);
		const result = await req.getAll();

		return result.length ? result[0] : null;
	}

	/**
	 * Checks whether the user is following the given channel.
	 *
	 * @param channel The channel to check for the user's follow.
	 */
	async follows(channel: UserIdResolvable) {
		return await this.getFollowTo(channel) !== null;
	}

	/**
	 * Follows the channel.
	 */
	async follow() {
		const currentUser = await this._client.users.getMe();
		return currentUser.followChannel(this);
	}

	/**
	 * Unfollows the channel.
	 */
	async unfollow() {
		const currentUser = await this._client.users.getMe();
		return currentUser.unfollowChannel(this);
	}
}
