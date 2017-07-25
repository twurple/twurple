import { Cacheable, Cached, ClearsCache } from '../../Toolkit/Decorators';
import BaseAPI from '../BaseAPI';
import Channel from './';
import UserTools, { UserIdResolvable } from '../../Toolkit/UserTools';
import ChannelSubscription, { ChannelSubscriptionData } from './ChannelSubscription';
import { StatusCodeError } from 'request-promise-native/errors';
import NotSubscribed from '../NotSubscribed';
import NoSubscriptionProgram from '../NoSubscriptionProgram';
import PrivilegedChannel from './PrivilegedChannel';
import User, { UserData } from '../User/';
import ChannelFollow, { ChannelFollowData } from './ChannelFollow';
import { UniformObject } from '../../Toolkit/ObjectTools';

export interface ChannelUpdateData {
	status?: string;
	game?: string;
	delay?: number;
	channel_feed_enabled?: boolean;
}

export type CommercialLength = 30 | 60 | 90 | 120 | 150 | 180;

@Cacheable
export default class ChannelAPI extends BaseAPI {
	@Cached(3600)
	async getMyChannel() {
		return new PrivilegedChannel(await this._client.apiCall({url: 'channel', scope: 'channel_read'}), this._client);
	}

	@Cached(3600)
	async getChannel(user: UserIdResolvable) {
		return new Channel(await this._client.apiCall({url: `channels/${UserTools.getUserId(user)}`}), this._client);
	}

	@ClearsCache<ChannelAPI>('getChannel', 1)
	async updateChannel(channel: UserIdResolvable, data: ChannelUpdateData) {
		const channelId = UserTools.getUserId(channel);
		await this._client.apiCall({
			url: `channels/${channelId}`,
			method: 'PUT',
			jsonBody: {channel: data},
			scope: 'channel_editor'
		});
	}

	@Cached(3600)
	async getChannelEditors(channel: UserIdResolvable): Promise<User[]> {
		const channelId = UserTools.getUserId(channel);
		const data = await this._client.apiCall({
			url: `channels/${channelId}/editors`,
			scope: 'channel_read'
		});
		return data.users.map((userData: UserData) => new User(userData, this._client));
	}

	@Cached(30)
	async getChannelFollowers(
		channel: UserIdResolvable,
		page?: number, limit?: number,
		orderDirection?: 'asc' | 'desc'
	): Promise<ChannelFollow[]> {
		const channelId = UserTools.getUserId(channel);

		let query: UniformObject<string> = {};
		if (page) {
			query.offset = ((page - 1) * (limit || 25)).toString();
		}
		if (limit) {
			query.limit = limit.toString();
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

	@Cached(30)
	async getChannelSubscriptions(
		channel: UserIdResolvable,
		page?: number, limit?: number,
		orderDirection?: 'asc' | 'desc'
	): Promise<ChannelSubscription[]> {
		const channelId = UserTools.getUserId(channel);

		let query: UniformObject<string> = {};
		if (page) {
			query.offset = ((page - 1) * (limit || 25)).toString();
		}
		if (limit) {
			query.limit = limit.toString();
		}
		if (orderDirection) {
			query.direction = orderDirection;
		}

		try {
			const data = await this._client.apiCall({
				url: `channels/${channelId}/subscriptions`,
				query,
				scope: `channel_subscriptions`
			});
			return data.subscriptions.map((sub: ChannelSubscriptionData) => new ChannelSubscription(sub, this._client));
		} catch (e) {
			if (e instanceof StatusCodeError && e.statusCode === 422) {
				throw new NoSubscriptionProgram(channelId);
			}

			throw e;
		}
	}

	@Cached(3600)
	async getChannelSubscriptionByUser(channel: UserIdResolvable, byUser: UserIdResolvable) {
		const channelId = UserTools.getUserId(channel);
		const userId = UserTools.getUserId(byUser);

		try {
			return new ChannelSubscription(
				await this._client.apiCall({
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

	async startChannelCommercial(channel: UserIdResolvable, length: CommercialLength) {
		const channelId = UserTools.getUserId(channel);
		return await this._client.apiCall({
			url: `channels/${channelId}/commercial`,
			method: 'POST',
			jsonBody: {length},
			scope: 'channel_commercial'
		});
	}

	@ClearsCache<ChannelAPI>('getMyChannel')
	async resetChannelStreamKey(channel: UserIdResolvable) {
		const channelId = UserTools.getUserId(channel);
		return await this._client.apiCall({
			url: `channels/${channelId}/stream_key`,
			method: 'DELETE',
			scope: 'channel_stream'
		});
	}
}
