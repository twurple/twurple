import User, { UserData } from '../User/User';
import { NonEnumerable } from '../../Toolkit/Decorators';
import TwitchClient from '../../TwitchClient';

/** @private */
export interface ChannelFollowData {
	created_at: string;
	notifications: boolean;
	user: UserData;
}

/**
 * A relation of a user following a previously given channel.
 */
export default class ChannelFollow {
	/** @private */
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: ChannelFollowData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The user following the given channel.
	 */
	get user() {
		return new User(this._data.user, this._client);
	}
}
