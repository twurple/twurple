import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixBanData } from '../../../interfaces/helix/moderation.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * Information about the ban of a user.
 */
@rtfm<HelixBan>('api', 'HelixBan', 'userId')
export class HelixBan extends DataObject<HelixBanData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixBanData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the banned user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the banned user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the banned user.
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

	/**
	 * The date when the ban will expire; null for permanent bans.
	 */
	get expiryDate(): Date | null {
		return this[rawDataSymbol].expires_at ? new Date(this[rawDataSymbol].expires_at) : null;
	}
}
