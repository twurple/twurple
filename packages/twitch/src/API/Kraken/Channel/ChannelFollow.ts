import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';
import User, { UserData } from '../User/User';

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

	/**
	 * Whether the user has notifications enabled for the channel.
	 */
	get hasNotifications() {
		return this._data.notifications;
	}

	/**
	 * The date when the user followed.
	 */
	get followDate() {
		return new Date(this._data.created_at);
	}
}
