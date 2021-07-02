import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { UserData } from '../user/User';
import { User } from '../user/User';

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
export class ChannelFollow extends DataObject<ChannelFollowData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: ChannelFollowData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The user following the given channel.
	 */
	get user(): User {
		return new User(this[rawDataSymbol].user, this._client);
	}

	/**
	 * The ID of the user following the given channel.
	 */
	get userId(): string {
		return this[rawDataSymbol].user._id;
	}

	/**
	 * Whether the user has notifications enabled for the channel.
	 */
	get hasNotifications(): boolean {
		return this[rawDataSymbol].notifications;
	}

	/**
	 * The date when the user followed.
	 */
	get followDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}
}
