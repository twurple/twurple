import { NonEnumerable } from '@d-fischer/shared-utils';
import NoSubscriptionProgramError from '../../../Errors/NoSubscriptionProgramError';
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
 * A Twitch user.
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
	 * The total number of views of the user's channel.
	 */
	get views() {
		return this._data.view_count;
	}

	/**
	 * Retrieves the channel's stream data.
	 */
	async getStream() {
		return this._client.helix.streams.getStreamByUserId(this);
	}

	/**
	 * Retrieves a list of broadcasters the user follows.
	 */
	async getFollows() {
		return this._client.helix.users.getFollows({ user: this });
	}

	/**
	 * Retrieves the follow data of the user to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to check the follow to.
	 */
	async getFollowTo(broadcaster: UserIdResolvable) {
		const params = {
			user: this.id,
			followedUser: broadcaster
		};

		const { data: result } = await this._client.helix.users.getFollows(params);

		return result.length ? result[0] : null;
	}

	/**
	 * Checks whether the user is following the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to check the user's follow to.
	 */
	async follows(broadcaster: UserIdResolvable) {
		return (await this.getFollowTo(broadcaster)) !== null;
	}

	/**
	 * Follows the broadcaster.
	 */
	async follow() {
		const currentUser = await this._client.kraken.users.getMe();
		return currentUser.followChannel(this);
	}

	/**
	 * Unfollows the broadcaster.
	 */
	async unfollow() {
		const currentUser = await this._client.kraken.users.getMe();
		return currentUser.unfollowChannel(this);
	}

	/**
	 * Retrieves the subscription data for the user to the given broadcaster, or `null` if the user is not subscribed.
	 *
	 * @param broadcaster The broadcaster you want to get the subscription data for.
	 */
	async getSubscriptionTo(broadcaster: UserIdResolvable) {
		return this._client.helix.subscriptions.getSubscriptionForUser(broadcaster, this);
	}

	/**
	 * Checks whether the user is subscribed to the given broadcaster.
	 *
	 * @param broadcaster The broadcaster you want to check the subscription for.
	 */
	async isSubscribedTo(broadcaster: UserIdResolvable) {
		try {
			return (await this.getSubscriptionTo(broadcaster)) !== null;
		} catch (e) {
			if (e instanceof NoSubscriptionProgramError) {
				return false;
			}

			throw e;
		}
	}
}
