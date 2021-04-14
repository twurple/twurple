import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { UserData } from '../User/User';
import { User } from '../User/User';

/** @private */
export interface ChannelFollowData {
	created_at: string;
	notifications: boolean;
	user: UserData;
}

/**
 * A relation of a user following a previously given channel.
 */
@rtfm<ChannelFollow>('api', 'ChannelFollow', 'userId')
export class ChannelFollow {
	@Enumerable(false) private readonly _data: ChannelFollowData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: ChannelFollowData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The user following the given channel.
	 */
	get user(): User {
		return new User(this._data.user, this._client);
	}

	/**
	 * The ID of the user following the given channel.
	 */
	get userId(): string {
		return this._data.user._id;
	}

	/**
	 * Whether the user has notifications enabled for the channel.
	 */
	get hasNotifications(): boolean {
		return this._data.notifications;
	}

	/**
	 * The date when the user followed.
	 */
	get followDate(): Date {
		return new Date(this._data.created_at);
	}
}
