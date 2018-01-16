import Twitch from '../../';
import { NonEnumerable } from '../../Toolkit/Decorators';
import User, { UserData } from './';

export interface UserBlockData {
	_id: string;
	updated_at: string;
	user: UserData;
}

export default class UserBlock {
	@NonEnumerable _client: Twitch;

	constructor(private readonly _data: UserBlockData, client: Twitch) {
		this._client = client;
	}

	get blockedUser() {
		return new User(this._data.user, this._client);
	}
}
