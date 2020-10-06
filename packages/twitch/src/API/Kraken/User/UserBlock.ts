import { Enumerable } from '@d-fischer/shared-utils';
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
export class UserBlock {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: UserBlockData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The blocked user.
	 */
	get blockedUser(): User {
		return new User(this._data.user, this._client);
	}
}
