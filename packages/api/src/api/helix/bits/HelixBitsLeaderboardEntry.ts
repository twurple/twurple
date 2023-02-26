import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import { type HelixBitsLeaderboardEntryData } from '../../../interfaces/helix/bits.external';
import { type HelixUser } from '../user/HelixUser';

/**
 * A Bits leaderboard entry.
 */
@rtfm<HelixBitsLeaderboardEntry>('api', 'HelixBitsLeaderboardEntry', 'userId')
export class HelixBitsLeaderboardEntry extends DataObject<HelixBitsLeaderboardEntryData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixBitsLeaderboardEntryData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user on the leaderboard.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user on the leaderboard.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user on the leaderboard.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * The position of the user on the leaderboard.
	 */
	get rank(): number {
		return this[rawDataSymbol].rank;
	}

	/**
	 * The amount of bits used in the given period of time.
	 */
	get amount(): number {
		return this[rawDataSymbol].score;
	}

	/**
	 * Gets the user of entry on the leaderboard.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}
}
