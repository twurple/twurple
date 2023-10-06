import { mapOptional } from '@d-fischer/shared-utils';
import { createBroadcasterQuery, type HelixResponse } from '@twurple/api-call';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import {
	createBitsLeaderboardQuery,
	type HelixBitsLeaderboardResponse,
	type HelixCheermoteData
} from '../../interfaces/endpoints/bits.external';
import { type HelixBitsLeaderboardQuery } from '../../interfaces/endpoints/bits.input';
import { BaseApi } from '../BaseApi';
import { HelixBitsLeaderboard } from './HelixBitsLeaderboard';
import { HelixCheermoteList } from './HelixCheermoteList';

/**
 * The Helix API methods that deal with bits.
 *
 * Can be accessed using `client.bits` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const leaderboard = await api.bits.getLeaderboard({ period: 'day' });
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Bits
 */
@rtfm('api', 'HelixBitsApi')
export class HelixBitsApi extends BaseApi {
	/**
	 * Gets a bits leaderboard of your channel.
	 *
	 * @param broadcaster The user to get the leaderboard of.
	 * @param params
	 * @expandParams
	 */
	async getLeaderboard(
		broadcaster: UserIdResolvable,
		params: HelixBitsLeaderboardQuery = {}
	): Promise<HelixBitsLeaderboard> {
		const result = await this._client.callApi<HelixBitsLeaderboardResponse>({
			type: 'helix',
			url: 'bits/leaderboard',
			userId: extractUserId(broadcaster),
			scopes: ['bits:read'],
			query: createBitsLeaderboardQuery(params)
		});

		return new HelixBitsLeaderboard(result, this._client);
	}

	/**
	 * Gets all available cheermotes.
	 *
	 * @param broadcaster The broadcaster to include custom cheermotes of.
	 *
	 * If not given, only get global cheermotes.
	 */
	async getCheermotes(broadcaster?: UserIdResolvable): Promise<HelixCheermoteList> {
		const result = await this._client.callApi<HelixResponse<HelixCheermoteData>>({
			type: 'helix',
			url: 'bits/cheermotes',
			userId: mapOptional(broadcaster, extractUserId),
			query: mapOptional(broadcaster, createBroadcasterQuery)
		});

		return new HelixCheermoteList(result.data);
	}
}
