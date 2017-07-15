import { Cacheable, Cached } from '../../Toolkit/Decorators';
import BaseAPI from '../BaseAPI';
import Channel from './';
import UserTools, { UserIdResolvable } from '../../Toolkit/UserTools';
import ChannelSubscription from './ChannelSubscription';
import { StatusCodeError } from 'request-promise-native/errors';
import NotSubscribed from '../NotSubscribed';
import NoSubscriptionProgram from '../NoSubscriptionProgram';

@Cacheable
export default class ChannelAPI extends BaseAPI {
	@Cached(3600)
	async getChannelByUser(user: UserIdResolvable) {
		return new Channel(await this._client.apiCall({url: `channels/${UserTools.getUserId(user)}`}), this._client);
	}

	@Cached(3600)
	async getSubscriptionData(channel: UserIdResolvable, byUser: UserIdResolvable) {
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
}
