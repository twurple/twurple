import UserTools, {UserIdResolvable} from '../Toolkit/UserTools';
import {Cacheable, Cached} from '../Toolkit/Decorators';
import CheermoteList, {CheermoteListData} from './CheermoteList';
import BaseAPI from './BaseAPI';
import {UniformObject} from '../Toolkit/ObjectTools';

@Cacheable
export default class BitsAPI extends BaseAPI {
	@Cached(3600)
	async getCheermotes(channel?: UserIdResolvable) {
		const query: UniformObject<string> = {};
		if (channel) {
			query.channel_id = UserTools.getUserId(channel);
		}

		const data: CheermoteListData = await this._client.apiCall({url: 'bits/actions', query});
		return new CheermoteList(data.actions, this._client);
	}
}
