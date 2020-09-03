import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';
import { User, UserData } from './User';

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
	get blockedUser() {
		return new User(this._data.user, this._client);
	}
}
