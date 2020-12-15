import { TwitchApiCallType } from 'twitch-api-call';
import { rtfm } from 'twitch-common';
import type { HelixResponse } from '../HelixResponse';
import type { UserIdResolvable } from '../../../Toolkit/UserTools';
import { extractUserId } from '../../../Toolkit/UserTools';
import { BaseApi } from '../../BaseApi';
import type { HelixBitsLeaderboardResponse } from './HelixBitsLeaderboard';
import { HelixBitsLeaderboard } from './HelixBitsLeaderboard';
import type { HelixCheermoteData } from './HelixCheermoteList';
import { HelixCheermoteList } from './HelixCheermoteList';

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
	startDate?: Date;

	/**
	 * The user ID to show.
	 *
	 * The leaderboard will be guaranteed to include this user and then have more users before and after that user.
	 */
	contextUserId?: string;
}

/**
 * The Helix API methods that deal with bits.
 *
 * Can be accessed using `client.helix.bits` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const leaderboard = await api.helix.bits.getLeaderboard({ period: 'day' });
 * ```
 */
@rtfm('twitch', 'HelixBitsApi')
export class HelixBitsApi extends BaseApi {
	/**
	 * Retrieves a bits leaderboard of your channel.
	 *
	 * @expandParams
	 */
	async getLeaderboard(params: HelixBitsLeaderboardQuery = {}): Promise<HelixBitsLeaderboard> {
		const { count = 10, period = 'all', startDate, contextUserId } = params;
		const result = await this._client.callApi<HelixBitsLeaderboardResponse>({
			type: TwitchApiCallType.Helix,
			url: 'bits/leaderboard',
			scope: 'bits:read',
			query: {
				count: count.toString(),
				period,
				started_at: startDate ? startDate.toISOString() : undefined,
				user_id: contextUserId
			}
		});

		return new HelixBitsLeaderboard(result, this._client);
	}

	/**
	 * Retrieves all available cheermotes.
	 *
	 * @param broadcaster The broadcaster to include custom cheermotes of.
	 *
	 * If not given, only retrieves global cheermotes.
	 */
	async getCheermotes(broadcaster?: UserIdResolvable): Promise<HelixCheermoteList> {
		const broadcasterId = broadcaster ? extractUserId(broadcaster) : undefined;
		const result = await this._client.callApi<HelixResponse<HelixCheermoteData>>({
			type: TwitchApiCallType.Helix,
			url: 'bits/cheermotes',
			query: {
				broadcaster_id: broadcasterId
			}
		});

		return new HelixCheermoteList(result.data, this._client);
	}
}
