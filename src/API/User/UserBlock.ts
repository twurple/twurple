import { NonEnumerable } from '../../Toolkit/Decorators';
import User, { UserData } from './User';
import TwitchClient from '../../TwitchClient';

/** @private */
export interface UserBlockData {
	_id: string;
	updated_at: string;
	user: UserData;
}

/**
 * A relation of a previously givn user blocking another user.
 */
export default class UserBlock {
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: UserBlockData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The blocked user.
	 */
	get blockedUser() {
		return new User(this._data.user, this._client);
	}
}
