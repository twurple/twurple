import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type ApiClient } from '../../../ApiClient';
import { type HelixCommonBanUserData } from '../../../interfaces/helix/moderation.external';
import { type HelixUser } from '../user/HelixUser';

/**
 * Information about a user who has been banned/timed out.
 *
 * @hideProtected
 */
@rtfm<HelixBanUser>('api', 'HelixBanUser', 'userId')
export class HelixBanUser extends DataObject<HelixCommonBanUserData> {
	@Enumerable(false) private readonly _client: ApiClient;
	@Enumerable(false) private readonly _broadcasterId: string;
	@Enumerable(false) private readonly _expiryTimestamp: string | null;

	/** @private */
	constructor(
		data: HelixCommonBanUserData,
		broadcasterId: string,
		expiryTimestamp: string | null,
		client: ApiClient
	) {
		super(data);
		this._broadcasterId = broadcasterId;
		this._expiryTimestamp = expiryTimestamp;
		this._client = client;
	}

	/**
	 * The ID of the broadcaster whose chat room the user was banned/timed out from chatting in.
	 *
	 * @deprecated As this is the result of a ban action or list request that takes the broadcaster ID as a parameter,
	 * use that directly instead.
	 */
	get broadcasterId(): string {
		return this._broadcasterId;
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
	 * @deprecated Use {@link HelixBanUser#expiryDate} instead.
	 */
	get endDate(): Date | null {
		return this.expiryDate;
	}

	/**
	 * The ID of the moderator that banned or put the user in the timeout.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_id;
	}

	/**
	 * Retrieves more information about the moderator that banned or put the user in the timeout.
	 */
	async getModerator(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].moderator_id))!;
	}

	/**
	 * The ID of the user that was banned or put in a timeout.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * Fetches more info about the user that was banned or put in a timeout.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
