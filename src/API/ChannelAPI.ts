import { Cacheable, Cached } from '../Toolkit/Decorators';
import BaseAPI from './BaseAPI';
import Channel from './Channel';
import UserTools, { UserIdResolvable } from '../Toolkit/UserTools';
import ChannelSubscription from './ChannelSubscription';

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

		return new ChannelSubscription(
			await this._client.apiCall({
				url: `channels/${channelId}/subscriptions/${userId}`,
				scope: 'channel_check_subscription'
			}),
			this._client
		);
	}
}
