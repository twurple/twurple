import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixModeratorData } from '../../../interfaces/helix/moderation.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * Information about the moderator status of a user.
 */
@rtfm<HelixModerator>('api', 'HelixModerator', 'userId')
export class HelixModerator extends DataObject<HelixModeratorData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixModeratorData, client: ApiClient) {
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
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
