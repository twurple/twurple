import { NonEnumerable } from '../../../Toolkit/Decorators';
import UserTools, { UserIdResolvable } from '../../../Toolkit/UserTools';
import NotFollowing from '../../NotFollowing';
import UserFollow from '../../User/UserFollow';
import HelixFollow, { HelixFollowFilter } from './HelixFollow';
import HelixPagination from '../HelixPagination';
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
	 * The URL to the profile picture of the user.
	 */
	get profilePictureUrl() {
		return this._data.profile_image_url;
	}

	/**
	 * Retrieves a list of channels the user follows.
	 *
	 * @param paginationParams Parameters for pagination.
	 */
	async getFollows(paginationParams: HelixPagination) {
		const params: HelixFollowFilter = paginationParams;
		params.user = this;
		const result = await this._client.helix.users.getFollows(params);

		return result.data;
	}

	/**
	 * Retrieves the follow data for this user to a given channel.
	 *
	 * @param channel
	 */
	async getFollowTo(channel: UserIdResolvable): Promise<HelixFollow> {
		const params = {
			user: this.id,
			followedUser: channel
		};

		const result = await this._client.helix.users.getFollows(params);

		if (!result.data.length) {
			throw new NotFollowing(this.id, UserTools.getUserId(channel));
		}

		return result.data[0];
	}

	/**
	 * Checks whether the user is following a given channel.
	 *
	 * @param channel The channel to check for the user's follow.
	 */
	async follows(channel: UserIdResolvable): Promise<boolean> {
		try {
			await this.getFollowTo(channel);
			return true;
		} catch (e) {
			if (e instanceof NotFollowing) {
				return false;
			}

			throw e;
		}
	}

	/**
	 * Follows the channel.
	 */
	async follow(): Promise<UserFollow> {
		const currentUser = await this._client.users.getMe();
		return currentUser.followChannel(this);
	}

	/**
	 * Unfollows the channel.
	 */
	async unfollow(): Promise<void> {
		const currentUser = await this._client.users.getMe();
		return currentUser.unfollowChannel(this);
	}
}
