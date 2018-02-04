import User, { UserData } from '../User/User';
import { NonEnumerable } from '../../Toolkit/Decorators';
import TwitchClient from '../../TwitchClient';

export interface ChannelFollowData {
	created_at: string;
	notifications: boolean;
	user: UserData;
}

export default class ChannelFollow {
	/** @private */
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: ChannelFollowData, client: TwitchClient) {
		this._client = client;
	}

	get user() {
		return new User(this._data.user, this._client);
	}
}
