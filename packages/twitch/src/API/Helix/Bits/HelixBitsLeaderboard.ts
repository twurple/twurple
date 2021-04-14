import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixDateRangeData } from '../HelixDateRangeData';
import type { HelixResponse } from '../HelixResponse';
import type { HelixBitsLeaderboardEntryData } from './HelixBitsLeaderboardEntry';
import { HelixBitsLeaderboardEntry } from './HelixBitsLeaderboardEntry';

/** @private */
export interface HelixBitsLeaderboardResponse extends HelixResponse<HelixBitsLeaderboardEntryData> {
	date_range: HelixDateRangeData;
	total: number;
}

/**
 * A leaderboard where the users who used the most bits to a broadcaster are listed.
 */
@Cacheable
@rtfm('twitch', 'HelixBitsLeaderboard')
export class HelixBitsLeaderboard {
	@Enumerable(false) private readonly _data: HelixBitsLeaderboardResponse;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixBitsLeaderboardResponse, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The entries of the leaderboard.
	 */
	@CachedGetter()
	get entries(): HelixBitsLeaderboardEntry[] {
		return this._data.data.map(entry => new HelixBitsLeaderboardEntry(entry, this._client));
	}

	/**
	 * The total amount of people on the requested leaderboard.
	 */
	get totalCount(): number {
		return this._data.total;
	}
}
