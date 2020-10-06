import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

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
	get userId(): string {
		return this._data.user_id;
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
	 * Retrieves the user that's on this place on the leaderboard.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}
}
