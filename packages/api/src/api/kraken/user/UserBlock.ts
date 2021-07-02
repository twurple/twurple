import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
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
export class UserBlock extends DataObject<UserBlockData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: UserBlockData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The blocked user.
	 */
	get blockedUser(): User {
		return new User(this[rawDataSymbol].user, this._client);
	}

	/**
	 * The ID of the blocked user.
	 */
	get blockedUserId(): string {
		return this[rawDataSymbol].user._id;
	}
}
