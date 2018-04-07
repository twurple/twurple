import { Cacheable, Cached } from '../../Toolkit/Decorators';
import BaseAPI from '../BaseAPI';
import Channel from '../Channel/Channel';
import ChattersList, { ChattersListData } from './ChattersList';
import UserTools, { UserIdResolvable } from '../../Toolkit/UserTools';
import ChannelEvent, { ChannelEventData, ChannelEventAPIResult } from './ChannelEvent';
import { TwitchApiCallType } from '../../TwitchClient';

@Cacheable
export default class UnsupportedAPI extends BaseAPI {
	@Cached(60)
	async getChatters(channel: string | Channel) {
		if (typeof channel !== 'string') {
			channel = channel.name;
		}

		const data: ChattersListData = await this._client.apiCall({
			url: `https://tmi.twitch.tv/group/user/${channel}/chatters`,
			type: TwitchApiCallType.Custom
		});
		return new ChattersList(data);
	}

	@Cached(60)
	async getEvents(channel: UserIdResolvable) {
		const channelId = UserTools.getUserId(channel);
		const data = await this._client.apiCall<ChannelEventAPIResult>({ url: `channels/${channelId}/events` });
		return data.events.map((event: ChannelEventData) => new ChannelEvent(event, this._client));
	}
}
