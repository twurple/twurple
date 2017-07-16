import Channel, { ChannelData } from '../Channel/';
import Twitch from '../../';
import { NonEnumerable } from '../../Toolkit/Decorators';

export interface UserFollowData {
	created_at: string;
	notifications: boolean;
	channel: ChannelData;
}

export default class UserFollow {
	@NonEnumerable _client: Twitch;

	constructor(private _data: UserFollowData, client: Twitch) {
		this._client = client;
	}

	get channel() {
		return new Channel(this._data.channel, this._client);
	}
}
