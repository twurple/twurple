import { mapOptional } from '@d-fischer/shared-utils';
import type { HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { rtfm } from '@twurple/common';
import {
	createBitsLeaderboardQuery,
	type HelixBitsLeaderboardResponse,
	type HelixCheermoteData
} from '../../../interfaces/helix/bits.external';
import { type HelixBitsLeaderboardQuery } from '../../../interfaces/helix/bits.input';
import { BaseApi } from '../../BaseApi';
import { HelixBitsLeaderboard } from './HelixBitsLeaderboard';
import { HelixCheermoteList } from './HelixCheermoteList';

/**
 * The Helix API methods that deal with bits.
 *
 * Can be accessed using `client.bits` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const leaderboard = await api.bits.getLeaderboard({ period: 'day' });
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Bits
 */
@rtfm('api', 'HelixBitsApi')
export class HelixBitsApi extends BaseApi {
	/**
	 * Retrieves a bits leaderboard of your channel.
	 *
	 * @param params
	 * @expandParams
	 */
	async getLeaderboard(params: HelixBitsLeaderboardQuery = {}): Promise<HelixBitsLeaderboard> {
		const result = await this._client.callApi<HelixBitsLeaderboardResponse>({
			type: 'helix',
			url: 'bits/leaderboard',
			scope: 'bits:read',
			query: createBitsLeaderboardQuery(params)
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
		const result = await this._client.callApi<HelixResponse<HelixCheermoteData>>({
			type: 'helix',
			url: 'bits/cheermotes',
			query: mapOptional(broadcaster, createBroadcasterQuery)
		});

		return new HelixCheermoteList(result.data);
	}
}
