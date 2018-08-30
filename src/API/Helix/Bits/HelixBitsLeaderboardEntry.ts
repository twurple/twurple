import { NonEnumerable } from '../../../Toolkit/Decorators';
import TwitchClient from '../../../TwitchClient';

/** @private */
export interface HelixBitsLeaderboardEntryData {
	user_id: string;
	rank: number;
	score: number;
}

/**
 * A Bits leaderboard entry.
 */
export default class HelixBitsLeaderboardEntry {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixBitsLeaderboardEntryData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The ID of the user on the leaderboard.
	 */
	get userId() {
		return this._data.user_id;
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
