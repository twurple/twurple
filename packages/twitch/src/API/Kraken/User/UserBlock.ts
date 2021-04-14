import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { UserData } from './User';
import { User } from './User';

/** @private */
export interface UserBlockData {
	_id: string;
	updated_at: string;
	user: UserData;
}

/**
 * A relation of a previously givn user blocking another user.
 */
@rtfm<UserBlock>('api', 'UserBlock', 'blockedUserId')
export class UserBlock {
	@Enumerable(false) private readonly _data: UserBlockData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: UserBlockData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The blocked user.
	 */
	get blockedUser(): User {
		return new User(this._data.user, this._client);
	}

	/**
	 * The ID of the blocked user.
	 */
	get blockedUserId(): string {
		return this._data.user._id;
	}
}
