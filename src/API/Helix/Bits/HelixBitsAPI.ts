import BaseAPI from '../../BaseAPI';
import { TwitchApiCallType } from '../../../TwitchClient';
import HelixBitsLeaderboard, { HelixBitsLeaderboardData } from './HelixBitsLeaderboard';

/**
 * The possible time periods for a bits leaderboard.
 */
export type HelixBitsLeaderboardPeriod = 'day' | 'week' | 'month' | 'year' | 'all';

/**
 * Filters for the bits leaderboard request.
 */
export interface HelixBitsLeaderboardQuery {
	/**
	 * The number of leaderboard entries you want to retrieve.
	 */
	count?: number;

	/**
	 * The time period from which bits should count towards the leaderboard.
	 *
	 * The leaderboards reset with the start of a new period, e.g. the `week` leaderboards reset every Monday midnight PST.
	 */
	period?: HelixBitsLeaderboardPeriod;

	/**
	 * The time to retrieve the bits leaderboard for.
	 */
	startedAt?: Date;

	/**
	 * The user ID to show.
	 *
	 * The leaderboard will be guaranteed to include this user and then have more users before and after that person.
	 */
	contextUserId?: string;
}

/**
 * The Helix API methods that deal with bits.
 *
 * Can be accessed using `client.helix.bits` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const leaderboard = await client.helix.bits.getLeaderboard({ period: 'day' });
 * ```
 */
export default class HelixBitsAPI extends BaseAPI {
	// TODO figure out how to document named params
	/**
	 * Gets a bits leaderboard of your channel.
	 */
	async getLeaderboard({ count = 10, period = 'all', startedAt, contextUserId }: HelixBitsLeaderboardQuery) {
		const result = await this._client.apiCall<HelixBitsLeaderboardData>({
			type: TwitchApiCallType.Helix,
			url: 'bits/leaderboard',
			method: 'GET',
			scope: 'bits:read',
			query: {
				count: count.toString(),
				period,
				started_at: startedAt ? startedAt.toISOString() : undefined,
				user_id: contextUserId
			}
		});

		return new HelixBitsLeaderboard(result, this._client);
	}
}
