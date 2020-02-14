import { NonEnumerable } from '@d-fischer/shared-utils';
import NoSubscriptionProgramError from '../../../Errors/NoSubscriptionProgramError';
import { UserIdResolvable } from '../../../Toolkit/UserTools';
import TwitchClient from '../../../TwitchClient';
import ChannelPlaceholder from '../Channel/ChannelPlaceholder';

/** @private */
export interface UserData {
	_id: string;
	bio: string;
	created_at: string;
	name: string;
	display_name: string;
	logo: string;
	type: string;
	updated_at: string;
}

/**
 * A Twitch user.
 */
export default class User {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(/** @private */ protected _data: UserData, client: TwitchClient) {
		this._client = client;
	}

	/** @private */
	get cacheKey() {
		return this._data._id;
	}

	/**
	 * The ID of the user.
	 */
	get id() {
		return this._data._id;
	}

	/**
	 * The bio of the user.
	 */
	get bio() {
		return this._data.bio;
	}

	/**
	 * The date when the user was created, i.e. when they registered on Twitch.
	 */
	get creationDate() {
		return new Date(this._data.created_at);
	}

	/**
	 * The last date when the user changed anything in their profile, e.g. their description or their profile picture.
	 */
	get updateDate() {
		return new Date(this._data.updated_at);
	}

	/**
	 * The user name of the user.
	 */
	get name() {
		return this._data.name;
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
	get logoUrl() {
		return this._data.logo;
	}

	/**
	 * The type of the user.
	 */
	get type() {
		return this._data.type;
	}

	/**
	 * Retrieves the channel data of the user.
	 */
	async getChannel() {
		return this._client.kraken.channels.getChannel(this);
	}

	/**
	 * Gets a channel placeholder object for the user, which can do anything you can do to a channel with just the ID.
	 */
	getChannelPlaceholder() {
		return new ChannelPlaceholder(this._data._id, this._client);
	}

	/**
	 * Retrieves the currently running stream of the user.
	 */
	async getStream() {
		return this.getChannelPlaceholder().getStream();
	}

	/**
	 * Retrieves the subscription data for the user to the given channel.
	 *
	 * Throws if the channel doesn't have a subscription program or the user is not subscribed to it.
	 *
	 * This method requires access to the user. If you only have access to the channel,
	 * use {@ChannelPlaceholder#getSubscriptionBy} instead.
	 *
	 * @param channel The channel you want to get the subscription data for.
	 */
	async getSubscriptionTo(channel: UserIdResolvable) {
		return this._client.kraken.users.getSubscriptionData(this, channel);
	}

	/**
	 * Checks whether the user is subscribed to the given channel.
	 *
	 * @param channel The channel you want to check the subscription for.
	 */
	async isSubscribedTo(channel: UserIdResolvable) {
		try {
			return (await this.getSubscriptionTo(channel)) !== null;
		} catch (e) {
			if (e instanceof NoSubscriptionProgramError) {
				return false;
			}

			throw e;
		}
	}

	/**
	 * Retrieves a list of channels followed by the user.
	 *
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 * @param orderBy The field to order by.
	 * @param orderDirection The direction to order in - ascending or descending.
	 */
	async getFollows(
		page?: number,
		limit?: number,
		orderBy?: 'created_at' | 'last_broadcast' | 'login',
		orderDirection?: 'asc' | 'desc'
	) {
		return this._client.kraken.users.getFollowedChannels(this, page, limit, orderBy, orderDirection);
	}

	/**
	 * Retrieves the follow data of the user to a given channel.
	 *
	 * @param channel The channel to retrieve the follow data for.
	 */
	async getFollowTo(channel: UserIdResolvable) {
		return this._client.kraken.users.getFollowedChannel(this, channel);
	}

	/**
	 * Checks whether the user is following the given channel.
	 *
	 * @param channel The channel to check for the user's follow.
	 */
	async follows(channel: UserIdResolvable) {
		try {
			return (await this.getFollowTo(channel)) !== null;
		} catch (e) {
			throw e;
		}
	}

	/**
	 * Follows the channel with the authenticated user.
	 */
	async follow() {
		const currentUser = await this._client.kraken.users.getMe();
		return currentUser.followChannel(this);
	}

	/**
	 * Unfollows the channel with the authenticated user.
	 */
	async unfollow() {
		const currentUser = await this._client.kraken.users.getMe();
		return currentUser.unfollowChannel(this);
	}

	/**
	 * Retrieves the emotes the user can use.
	 */
	async getEmotes() {
		return this._client.kraken.users.getUserEmotes(this);
	}
}
