import HelixDateRangeData from '../HelixDateRangeData';
import { Cacheable, CachedGetter, NonEnumerable } from '../../../Toolkit/Decorators';
import TwitchClient from '../../../TwitchClient';
import HelixBitsLeaderboardEntry, { HelixBitsLeaderboardEntryData } from './HelixBitsLeaderboardEntry';
import HelixResponse from '../HelixResponse';

/** @private */
export interface HelixBitsLeaderboardResponse extends HelixResponse<HelixBitsLeaderboardEntryData> {
	date_range: HelixDateRangeData;
	total: number;
}

/**
 * A leaderboard where the users who used the most bits in a channel are listed.
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
