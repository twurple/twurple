import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';
import HelixDateRangeData from '../HelixDateRangeData';
import HelixResponse from '../HelixResponse';
import HelixBitsLeaderboardEntry, { HelixBitsLeaderboardEntryData } from './HelixBitsLeaderboardEntry';

/** @private */
export interface HelixBitsLeaderboardResponse extends HelixResponse<HelixBitsLeaderboardEntryData> {
	date_range: HelixDateRangeData;
	total: number;
}

/**
 * A leaderboard where the users who used the most bits to a broadcaster are listed.
 */
@Cacheable
export default class HelixBitsLeaderboard {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixBitsLeaderboardResponse, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The entries of the leaderboard.
	 */
	@CachedGetter()
	get entries() {
		return this._data.data.map(entry => new HelixBitsLeaderboardEntry(entry, this._client));
	}

	/**
	 * The total amount of people on the requested leaderboard.
	 */
	get totalCount() {
		return this._data.total;
	}
}
