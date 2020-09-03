import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';

/** @private */
export interface HelixBitsLeaderboardEntryData {
	user_id: string;
	user_name: string;
	rank: number;
	score: number;
}

/**
 * A Bits leaderboard entry.
 */
export class HelixBitsLeaderboardEntry {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: HelixBitsLeaderboardEntryData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the user on the leaderboard.
	 */
	get userId() {
		return this._data.user_id;
	}

	/**
	 * The display name of the user on the leaderboard.
	 */
	get userDisplayName() {
		return this._data.user_name;
	}

	/**
	 * The position of the user on the leaderboard.
	 */
	get rank() {
		return this._data.rank;
	}

	/**
	 * The amount of bits used in the given period of time.
	 */
	get amount() {
		return this._data.score;
	}

	/**
	 * Retrieves the user that's on this place on the leaderboard.
	 */
	async getUser() {
		return this._client.helix.users.getUserById(this._data.user_id);
	}
}
