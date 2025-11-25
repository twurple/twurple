import { createBroadcasterQuery, type HelixResponse } from '@twurple/api-call';
import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixHypeTrainStatusData } from '../../interfaces/endpoints/hypeTrain.external';
import { BaseApi } from '../BaseApi';
import { HelixHypeTrainStatus } from './HelixHypeTrainStatus';

/**
 * The Helix API methods that deal with Hype Trains.
 *
 * Can be accessed using `client.hypeTrain` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const { data: events } = await api.hypeTrain.getHypeTrainEventsForBroadcaster('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Hype Trains
 */
export class HelixHypeTrainApi extends BaseApi {
	/**
	 * Gets the Hype Train status and statistics for the specified broadcaster.
	 *
	 * @param broadcaster The broadcaster to fetch Hype Train info for.
	 */
	async getHypeTrainStatusForBroadcaster(broadcaster: UserIdResolvable): Promise<HelixHypeTrainStatus> {
		const result = await this._client.callApi<HelixResponse<HelixHypeTrainStatusData>>({
			type: 'helix',
			url: 'hypetrain/status',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:hype_train'],
			query: {
				...createBroadcasterQuery(broadcaster),
			},
		});

		return new HelixHypeTrainStatus(result.data[0], this._client);
	}
}
