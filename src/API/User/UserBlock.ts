import { NonEnumerable } from '../../Toolkit/Decorators';
import User, { UserData } from './User';
import TwitchClient from '../../TwitchClient';

export interface UserBlockData {
	_id: string;
	updated_at: string;
	user: UserData;
}

export default class UserBlock {
	@NonEnumerable _client: TwitchClient;

	constructor(private readonly _data: UserBlockData, client: TwitchClient) {
		this._client = client;
	}

	get blockedUser() {
		return new User(this._data.user, this._client);
	}
}
