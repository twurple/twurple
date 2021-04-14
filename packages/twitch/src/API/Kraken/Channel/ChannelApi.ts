import { HttpStatusCodeError } from '@twurple/api-call';
import type { CommercialLength, UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { NoSubscriptionProgramError } from '../../../Errors/NoSubscriptionProgramError';
import { BaseApi } from '../../BaseApi';
import type { TeamData } from '../Team/Team';
import { Team } from '../Team/Team';
import type { UserData } from '../User/User';
import { User } from '../User/User';
import { Channel } from './Channel';
import type { ChannelFollowData } from './ChannelFollow';
import { ChannelFollow } from './ChannelFollow';
import type { ChannelSubscriptionData, ChannelSubscriptionsResponse } from './ChannelSubscription';
import { ChannelSubscription } from './ChannelSubscription';
import type { PrivilegedChannelData } from './PrivilegedChannel';
import { PrivilegedChannel } from './PrivilegedChannel';

/**
 * Channel data to update using {@ChannelApi#updateChannel}.
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
 * The API methods that deal with channels.
 *
 * Can be accessed using `client.kraken.channels` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const channel = await api.kraken.channels.getMyChannel();
 * ```
 */
@rtfm('twitch', 'ChannelApi')
export class ChannelApi extends BaseApi {
	/**
	 * Gets the channel the client is logged in to.
	 */
	async getMyChannel(): Promise<PrivilegedChannel> {
		return new PrivilegedChannel(
			await this._client.callApi<PrivilegedChannelData>({ url: 'channel', scope: 'channel_read' }),
			this._client
		);
	}

	/**
	 * Retrieves the channel for the given user.
	 *
	 * @param user The user you want to retrieve the channel for.
	 */
	async getChannel(user: UserIdResolvable): Promise<Channel> {
		return new Channel(await this._client.callApi({ url: `channels/${extractUserId(user)}` }), this._client);
	}

	/**
	 * Updates the given channel with the given data.
	 *
	 * @param channel The channel you want to update.
	 * @param data The updated channel data.
	 */
	async updateChannel(channel: UserIdResolvable, data: ChannelUpdateData): Promise<void> {
		const channelId = extractUserId(channel);
		await this._client.callApi({
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
	async getChannelEditors(channel: UserIdResolvable): Promise<User[]> {
		const channelId = extractUserId(channel);
		const data = await this._client.callApi<{ users: UserData[] }>({
			url: `channels/${channelId}/editors`,
			scope: 'channel_read'
		});
		return data.users.map(userData => new User(userData, this._client));
	}

	/**
	 * Retrieves the list of followers of the given channel.
	 *
	 * @param channel The channel you want to retrieve the list of followers of.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 * @param orderDirection The direction to order in - ascending or descending.
	 */
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

		const data = await this._client.callApi<{ follows: ChannelFollowData[] }>({
			url: `channels/${channelId}/follows`,
			query
		});
		return data.follows.map(followData => new ChannelFollow(followData, this._client));
	}

	/**
	 * Retrieves the list of subscribers of the given channel.
	 *
	 * @param channel The channel you want to retrieve the list of subscribers of.
	 * @param page The result page you want to retrieve.
	 * @param limit The number of results you want to retrieve.
	 * @param orderDirection The direction to order in - ascending or descending.
	 */
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
	 * use {@UserApi#getSubscriptionData} instead.
	 *
	 * @param channel The channel to check the subscription to.
	 * @param byUser The user to check the subscription for.
	 */
	async getChannelSubscriptionByUser(
		channel: UserIdResolvable,
		byUser: UserIdResolvable
	): Promise<ChannelSubscription | null> {
		const channelId = extractUserId(channel);
		const userId = extractUserId(byUser);

		try {
			return new ChannelSubscription(
				await this._client.callApi<ChannelSubscriptionData>({
					url: `channels/${channelId}/subscriptions/${userId}`,
					scope: 'channel_check_subscription'
				}),
				this._client
			);
		} catch (e) {
			if (e instanceof HttpStatusCodeError) {
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
	 * Retrieves a list of teams of the given channel.
	 *
	 * @param channel The channel you want to retrieve the list of teams of.
	 */
	async getChannelTeams(channel: UserIdResolvable): Promise<Team[]> {
		const channelId = extractUserId(channel);

		const data = await this._client.callApi<{ teams: TeamData[] }>({
			url: `channels/${channelId}/teams`,
			method: 'GET'
		});

		return data.teams.map(teamData => new Team(teamData, this._client));
	}

	/**
	 * Starts a commercial in the given channel.
	 *
	 * @param channel The channel to start the commercial in.
	 * @param length The length of the commercial.
	 */
	async startChannelCommercial(channel: UserIdResolvable, length: CommercialLength): Promise<void> {
		const channelId = extractUserId(channel);
		await this._client.callApi({
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
	async resetChannelStreamKey(channel: UserIdResolvable): Promise<PrivilegedChannel> {
		const channelId = extractUserId(channel);
		const channelData = await this._client.callApi<PrivilegedChannelData>({
			url: `channels/${channelId}/stream_key`,
			method: 'DELETE',
			scope: 'channel_stream'
		});

		return new PrivilegedChannel(channelData, this._client);
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
			return await this._client.callApi({
				url: `channels/${channelId}/subscriptions`,
				query,
				scope: 'channel_subscriptions'
			});
		} catch (e) {
			if (e instanceof HttpStatusCodeError && e.statusCode === 422) {
				throw new NoSubscriptionProgramError(channelId);
			}

			throw e;
		}
	}
}
