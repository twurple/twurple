import { Cacheable, Cached, ClearsCache } from '../../Toolkit/Decorators';
import BaseAPI from '../BaseAPI';
import Channel from './Channel';
import UserTools, { UserIdResolvable } from '../../Toolkit/UserTools';
import ChannelSubscription, { ChannelSubscriptionData } from './ChannelSubscription';
import { StatusCodeError } from 'request-promise-native/errors';
import NotSubscribed from '../NotSubscribed';
import NoSubscriptionProgram from '../NoSubscriptionProgram';
import PrivilegedChannel, { PrivilegedChannelData } from './PrivilegedChannel';
import User, { UserData } from '../User/User';
import ChannelFollow, { ChannelFollowData } from './ChannelFollow';
import { UniformObject } from '../../Toolkit/ObjectTools';

/**
 * Channel data to update using {@ChannelAPI#updateChannel}.
 */
export interface ChannelUpdateData {
	/**
	 * The status/title of the channel.
	 */
	status?: string;

	/**
	 * The currently played game.
	 */
	game?: string;

	/**
	 * The desired delay of the stream.
	 */
	delay?: number;

	/**
	 * Whether or not to show the channel feed.
	 */
	channel_feed_enabled?: boolean;
}

/**
 * The possible lengths of a channel commercial.
 */
export type CommercialLength = 30 | 60 | 90 | 120 | 150 | 180;

/**
 * The API methods that deal with channels.
 *
 * Can be accessed using `client.channels` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const channel = await client.channels.getMyChannel();
 * ```
 */
@Cacheable
export default class ChannelAPI extends BaseAPI {
	/**
	 * Gets the channel the client is logged in to.
	 */
	@Cached(3600)
	async getMyChannel() {
		return new PrivilegedChannel(await this._client.apiCall({ url: 'channel', scope: 'channel_read' }), this._client);
	}

	/**
	 * Retrieves the channel for the given user.
	 *
	 * @param user The user you want to retrieve the channel for.
	 */
	@Cached(3600)
	async getChannel(user: UserIdResolvable) {
		return new Channel(await this._client.apiCall({ url: `channels/${UserTools.getUserId(user)}` }), this._client);
	}

	/**
	 * Updates the given channel with the given data.
	 *
	 * @param channel The channel you want to update.
	 * @param data The updated channel data.
	 */
	@ClearsCache<ChannelAPI>('getChannel', 1)
	async updateChannel(channel: UserIdResolvable, data: ChannelUpdateData) {
		const channelId = UserTools.getUserId(channel);
		await this._client.apiCall({
			url: `channels/${channelId}`,
			method: 'PUT',
			jsonBody: { channel: data },
			scope: 'channel_editor'
		});
	}

	/**
	 * Retrieves the list of users that have editor rights to the given channel.
	 *
	 * @param channel The channel you want to retrieve the list of editors for.
	 */
	@Cached(3600)
	async getChannelEditors(channel: UserIdResolvable): Promise<User[]> {
		const channelId = UserTools.getUserId(channel);
		const data = await this._client.apiCall({
			url: `channels/${channelId}/editors`,
			scope: 'channel_read'
		});
		return data.users.map((userData: UserData) => new User(userData, this._client));
	}

	/**
	 * Retrieves the list of followers of the given channel.
	 *
	 * @param channel The channel you want to retrieve the list of followers of.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 * @param orderDirection The direction to order in - ascending or descending.
	 */
	@Cached(30)
	async getChannelFollowers(
		channel: UserIdResolvable,
		page?: number, limit: number = 25,
		orderDirection?: 'asc' | 'desc'
	): Promise<ChannelFollow[]> {
		const channelId = UserTools.getUserId(channel);

		const query: UniformObject<string> = { limit: limit.toString() };
		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		if (orderDirection) {
			query.direction = orderDirection;
		}

		const data = await this._client.apiCall({
			url: `channels/${channelId}/follows`,
			query
		});
		return data.follows.map((follow: ChannelFollowData) => new ChannelFollow(follow, this._client));
	}

	/**
	 * Retrieves the list of subscribers of the given channel.
	 *
	 * @param channel The channel you want to retrieve the list of subscribers of.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 * @param orderDirection The direction to order in - ascending or descending.
	 */
	@Cached(30)
	async getChannelSubscriptions(
		channel: UserIdResolvable,
		page?: number, limit: number = 25,
		orderDirection?: 'asc' | 'desc'
	): Promise<ChannelSubscription[]> {
		const channelId = UserTools.getUserId(channel);

		const query: UniformObject<string> = { limit: limit.toString() };

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		if (orderDirection) {
			query.direction = orderDirection;
		}

		try {
			const data = await this._client.apiCall({
				url: `channels/${channelId}/subscriptions`,
				query,
				scope: 'channel_subscriptions'
			});

			return data.subscriptions.map((sub: ChannelSubscriptionData) => new ChannelSubscription(sub, this._client));
		} catch (e) {
			if (e instanceof StatusCodeError && e.statusCode === 422) {
				throw new NoSubscriptionProgram(channelId);
			}

			throw e;
		}
	}

	/**
	 * Retrieves the subscription data for the given user to a given channel.
	 *
	 * Throws if the channel doesn't have a subscription program or the user is not subscribed to it.
	 *
	 * This method requires access to the channel. If you only have access to the user,
	 * use {@UserAPI#getSubscriptionData} instead.
	 *
	 * @param channel The channel to check the subscription to.
	 * @param byUser The user to check the subscription for.
	 */
	@Cached(3600)
	async getChannelSubscriptionByUser(channel: UserIdResolvable, byUser: UserIdResolvable) {
		const channelId = UserTools.getUserId(channel);
		const userId = UserTools.getUserId(byUser);

		try {
			return new ChannelSubscription(
				await this._client.apiCall<ChannelSubscriptionData>({
					url: `channels/${channelId}/subscriptions/${userId}`,
					scope: 'channel_check_subscription'
				}),
				this._client
			);
		} catch (e) {
			if (e instanceof StatusCodeError) {
				if (e.statusCode === 404) {
					throw new NotSubscribed(channelId, userId);
				} else if (e.statusCode === 422) {
					throw new NoSubscriptionProgram(channelId);
				}
			}

			throw e;
		}
	}

	/**
	 * Starts a commercial in the given channel.
	 *
	 * @param channel The channel to start the commercial in.
	 * @param length The length of the commercial.
	 */
	async startChannelCommercial(channel: UserIdResolvable, length: CommercialLength) {
		const channelId = UserTools.getUserId(channel);
		return this._client.apiCall<void>({
			url: `channels/${channelId}/commercial`,
			method: 'POST',
			jsonBody: { length },
			scope: 'channel_commercial'
		});
	}

	/**
	 * Resets the given channel's stream key.
	 *
	 * @param channel The channel to reset the stream key for.
	 */
	@ClearsCache<ChannelAPI>('getMyChannel')
	async resetChannelStreamKey(channel: UserIdResolvable) {
		const channelId = UserTools.getUserId(channel);
		return this._client.apiCall<PrivilegedChannelData>({
			url: `channels/${channelId}/stream_key`,
			method: 'DELETE',
			scope: 'channel_stream'
		});
	}
}
