import { Cacheable, Cached } from '../../Toolkit/Decorators';
import BaseAPI from '../BaseAPI';
import Channel from '../Channel';
import { default as ChattersList, ChattersListData } from './ChattersList';

@Cacheable
export default class UnsupportedAPI extends BaseAPI {
	@Cached(60)
	async getChatters(channel: string | Channel) {
		if (typeof channel !== 'string') {
			channel = channel.name;
		}

		const data: ChattersListData = await this._client.apiCall({url: `https://tmi.twitch.tv/group/user/${channel}/chatters`, type: 'custom'});
		return new ChattersList(data);
	}
}
