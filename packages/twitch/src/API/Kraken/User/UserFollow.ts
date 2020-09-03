import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';
import { Channel, ChannelData } from '../Channel/Channel';

/** @private */
export interface UserFollowData {
	created_at: string;
	notifications: boolean;
	channel: ChannelData;
}

/**
 * A relation of a previously given user following a channel.
 */
export class UserFollow {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: UserFollowData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The date when the user followed the channel.
	 */
	get followDate() {
		return new Date(this._data.created_at);
	}

	/**
	 * Whether the user has notifications enabled for the channel.
	 */
	get hasNotifications() {
		return this._data.notifications;
	}

	/**
	 * The followed channel.
	 */
	get channel() {
		return new Channel(this._data.channel, this._client);
	}
}
