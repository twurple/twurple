import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import { type HelixCommonBanUserData } from '../../../interfaces/helix/moderation.external';
import { type HelixUser } from '../user/HelixUser';

/**
 * Information about a user who has been banned/timed out.
 *
 * @hideProtected
 */
@rtfm<HelixBanUser>('api', 'HelixBanUser', 'userId')
export class HelixBanUser extends DataObject<HelixCommonBanUserData> {
	@Enumerable(false) private readonly _client: BaseApiClient;
	@Enumerable(false) private readonly _expiryTimestamp: string | null;

	/** @private */
	constructor(data: HelixCommonBanUserData, expiryTimestamp: string | null, client: BaseApiClient) {
		super(data);
		this._expiryTimestamp = expiryTimestamp;
		this._client = client;
	}

	/**
	 * The date and time that the ban/timeout was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The date and time that the timeout will end. Is `null` if the user was banned instead of put in a timeout.
	 */
	get expiryDate(): Date | null {
		return mapNullable(this._expiryTimestamp, ts => new Date(ts));
	}

	/**
	 * The ID of the moderator that banned or put the user in the timeout.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_id;
	}

	/**
	 * Gets more information about the moderator that banned or put the user in the timeout.
	 */
	async getModerator(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].moderator_id));
	}

	/**
	 * The ID of the user that was banned or put in a timeout.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * Gets more information about the user that was banned or put in a timeout.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}
}
