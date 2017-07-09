import {Cacheable, Cached} from '../Toolkit/Decorators';
import BaseAPI from './BaseAPI';
import Channel from './Channel';
import UserTools, {UserIdResolvable} from '../Toolkit/UserTools';

@Cacheable
export default class UserAPI extends BaseAPI {
	@Cached(3600)
	async getChannelByUser(user: UserIdResolvable) {
		return new Channel(await this._client.apiCall({url: `channels/${UserTools.getUserId(user)}`}), this._client);
	}
}
