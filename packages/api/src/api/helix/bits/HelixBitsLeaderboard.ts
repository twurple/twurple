import { Cacheable, CachedGetter } from '@d-fischer/cache-decorators';
import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixBitsLeaderboardResponse } from '../../../interfaces/helix/bits.external';
import { HelixBitsLeaderboardEntry } from './HelixBitsLeaderboardEntry';

/**
 * A leaderboard where the users who used the most bits to a broadcaster are listed.
 */
@Cacheable
@rtfm('api', 'HelixBitsLeaderboard')
export class HelixBitsLeaderboard extends DataObject<HelixBitsLeaderboardResponse> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixBitsLeaderboardResponse, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The entries of the leaderboard.
	 */
	@CachedGetter()
	get entries(): HelixBitsLeaderboardEntry[] {
		return this[rawDataSymbol].data.map(entry => new HelixBitsLeaderboardEntry(entry, this._client));
	}

	/**
	 * The total amount of people on the requested leaderboard.
	 */
	get totalCount(): number {
		return this[rawDataSymbol].total;
	}
}
