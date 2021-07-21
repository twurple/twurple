import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';

/** @private */
export interface HelixBitsLeaderboardEntryData {
	user_id: string;
	user_login: string;
	user_name: string;
	rank: number;
	score: number;
}

/**
 * A Bits leaderboard entry.
 */
@rtfm<HelixBitsLeaderboardEntry>('api', 'HelixBitsLeaderboardEntry', 'userId')
export class HelixBitsLeaderboardEntry extends DataObject<HelixBitsLeaderboardEntryData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixBitsLeaderboardEntryData, client: ApiClient) {
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
	 * Retrieves the user of entry on the leaderboard.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
