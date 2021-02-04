import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

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
@rtfm<HelixBitsLeaderboardEntry>('twitch', 'HelixBitsLeaderboardEntry', 'userId')
export class HelixBitsLeaderboardEntry {
	@Enumerable(false) private readonly _data: HelixBitsLeaderboardEntryData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixBitsLeaderboardEntryData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the user on the leaderboard.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the user on the leaderboard.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the user on the leaderboard.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * The position of the user on the leaderboard.
	 */
	get rank(): number {
		return this._data.rank;
	}

	/**
	 * The amount of bits used in the given period of time.
	 */
	get amount(): number {
		return this._data.score;
	}

	/**
	 * Retrieves the user of entry on the leaderboard.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}
}
