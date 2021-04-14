import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { ChannelData } from '../Channel/Channel';
import { Channel } from '../Channel/Channel';

/** @private */
export interface UserFollowData {
	created_at: string;
	notifications: boolean;
	channel: ChannelData;
}

/**
 * A relation of a previously given user following a channel.
 */
@rtfm<UserFollow>('api', 'UserFollow', 'channelId')
export class UserFollow {
	@Enumerable(false) private readonly _data: UserFollowData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: UserFollowData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The date when the user followed the channel.
	 */
	get followDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * Whether the user has notifications enabled for the channel.
	 */
	get hasNotifications(): boolean {
		return this._data.notifications;
	}

	/**
	 * The followed channel.
	 */
	get channel(): Channel {
		return new Channel(this._data.channel, this._client);
	}

	/**
	 * The ID of the followed channel.
	 */
	get channelId(): string {
		return this._data.channel._id;
	}
}
