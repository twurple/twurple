import { Cacheable, Cached, ClearsCache } from '@d-fischer/cache-decorators';
import HTTPStatusCodeError from '../../../Errors/HTTPStatusCodeError';
import NoSubscriptionProgramError from '../../../Errors/NoSubscriptionProgramError';
import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import BaseAPI from '../../BaseAPI';
import User, { UserData } from '../User/User';
import Channel from './Channel';
import ChannelFollow, { ChannelFollowData } from './ChannelFollow';
import ChannelSubscription, { ChannelSubscriptionData, ChannelSubscriptionsResponse } from './ChannelSubscription';
import PrivilegedChannel, { PrivilegedChannelData } from './PrivilegedChannel';

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
 * Can be accessed using `client.kraken.channels` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const channel = await client.kraken.channels.getMyChannel();
 * ```
 */
@Cacheable
export default class ChannelAPI extends BaseAPI {
	/**
	 * Gets the channel the client is logged in to.
	 */
	@Cached(3600)
	async getMyChannel() {
		return new PrivilegedChannel(
			await this._client.callAPI({ url: 'channel', scope: 'channel_read' }),
			this._client
		);
	}

	/**
	 * Retrieves the channel for the given user.
	 *
	 * @param user The user you want to retrieve the channel for.
	 */
	@Cached(3600)
	async getChannel(user: UserIdResolvable) {
		return new Channel(await this._client.callAPI({ url: `channels/${extractUserId(user)}` }), this._client);
	}

	/**
	 * Updates the given channel with the given data.
	 *
	 * @param channel The channel you want to update.
	 * @param data The updated channel data.
	 */
	@ClearsCache<ChannelAPI>('getChannel', 1)
	async updateChannel(channel: UserIdResolvable, data: ChannelUpdateData) {
		const channelId = extractUserId(channel);
		await this._client.callAPI({
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
		const channelId = extractUserId(channel);
		const data = await this._client.callAPI({
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
		page?: number,
		limit: number = 25,
		orderDirection?: 'asc' | 'desc'
	): Promise<ChannelFollow[]> {
		const channelId = extractUserId(channel);

		const query: Record<string, string> = { limit: limit.toString() };
		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		if (orderDirection) {
			query.direction = orderDirection;
		}

		const data = await this._client.callAPI({
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
		page?: number,
		limit: number = 25,
		orderDirection?: 'asc' | 'desc'
	): Promise<ChannelSubscription[]> {
		const data = await this._getChannelSubscriptions(channel, page, limit, orderDirection);

		return data.subscriptions.map(sub => new ChannelSubscription(sub, this._client));
	}

	/**
	 * Retrieves the total number of subscribers for the given channel.
	 *
	 * @param channel The channel you want to retrieve the number of subscribers for.
	 */
	@Cached(30)
	async getChannelSubscriptionCount(channel: UserIdResolvable): Promise<number> {
		const data = await this._getChannelSubscriptions(channel, 0, 1);

		return data._total;
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
		const channelId = extractUserId(channel);
		const userId = extractUserId(byUser);

		try {
			return new ChannelSubscription(
				await this._client.callAPI<ChannelSubscriptionData>({
					url: `channels/${channelId}/subscriptions/${userId}`,
					scope: 'channel_check_subscription'
				}),
				this._client
			);
		} catch (e) {
			if (e instanceof HTTPStatusCodeError) {
				if (e.statusCode === 404) {
					return null;
				} else if (e.statusCode === 422) {
					throw new NoSubscriptionProgramError(channelId);
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
		const channelId = extractUserId(channel);
		return this._client.callAPI<void>({
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
		const channelId = extractUserId(channel);
		return this._client.callAPI<PrivilegedChannelData>({
			url: `channels/${channelId}/stream_key`,
			method: 'DELETE',
			scope: 'channel_stream'
		});
	}

	private async _getChannelSubscriptions(
		channel: UserIdResolvable,
		page?: number,
		limit: number = 25,
		orderDirection?: 'asc' | 'desc'
	): Promise<ChannelSubscriptionsResponse> {
		const channelId = extractUserId(channel);

		const query: Record<string, string> = { limit: limit.toString() };

		if (page) {
			query.offset = ((page - 1) * limit).toString();
		}

		if (orderDirection) {
			query.direction = orderDirection;
		}

		try {
			return await this._client.callAPI({
				url: `channels/${channelId}/subscriptions`,
				query,
				scope: 'channel_subscriptions'
			});
		} catch (e) {
			if (e instanceof HTTPStatusCodeError && e.statusCode === 422) {
				throw new NoSubscriptionProgramError(channelId);
			}

			throw e;
		}
	}
}
