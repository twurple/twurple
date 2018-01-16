import User, { UserData } from '../User/';
import Twitch from '../../';
import { NonEnumerable } from '../../Toolkit/Decorators';

export interface ChannelFollowData {
	created_at: string;
	notifications: boolean;
	user: UserData;
}

export default class ChannelFollow {
	@NonEnumerable _client: Twitch;

	constructor(private readonly _data: ChannelFollowData, client: Twitch) {
		this._client = client;
	}

	get user() {
		return new User(this._data.user, this._client);
	}
}
