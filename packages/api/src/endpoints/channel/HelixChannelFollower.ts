import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { BaseApiClient } from '../../client/BaseApiClient';
import type { HelixChannelFollowerData } from '../../interfaces/endpoints/channel.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * Represents a user that follows a channel.
 */
@rtfm<HelixChannelFollower>('api', 'HelixChannelFollower', 'userId')
export class HelixChannelFollower extends DataObject<HelixChannelFollowerData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixChannelFollowerData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets additional information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The date when the user followed the broadcaster.
	 */
	get followDate(): Date {
		return new Date(this[rawDataSymbol].followed_at);
	}
}
