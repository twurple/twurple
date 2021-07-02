import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { ChannelData } from '../channel/Channel';
import { Channel } from '../channel/Channel';

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
export class UserFollow extends DataObject<UserFollowData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: UserFollowData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The date when the user followed the channel.
	 */
	get followDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * Whether the user has notifications enabled for the channel.
	 */
	get hasNotifications(): boolean {
		return this[rawDataSymbol].notifications;
	}

	/**
	 * The followed channel.
	 */
	get channel(): Channel {
		return new Channel(this[rawDataSymbol].channel, this._client);
	}

	/**
	 * The ID of the followed channel.
	 */
	get channelId(): string {
		return this[rawDataSymbol].channel._id;
	}
}
