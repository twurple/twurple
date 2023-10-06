import { createBroadcasterQuery, type HelixPaginatedResponse } from '@twurple/api-call';
import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixEventData } from '../../interfaces/endpoints/generic.external';
import {
	type HelixHypeTrainEventData,
	type HelixHypeTrainEventType
} from '../../interfaces/endpoints/hypeTrain.external';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import { createPaginatedResult, type HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginationQuery, type HelixForwardPagination } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixHypeTrainEvent } from './HelixHypeTrainEvent';

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
	 * Gets the events of the current or latest Hype Train for the specified broadcaster.
	 *
	 * @param broadcaster The broadcaster to fetch Hype Train events for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getHypeTrainEventsForBroadcaster(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixHypeTrainEvent>> {
		const result = await this._client.callApi<
			HelixPaginatedResponse<HelixEventData<HelixHypeTrainEventData, HelixHypeTrainEventType>>
		>({
			type: 'helix',
			url: 'hypetrain/events',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:hype_train'],
			query: {
				...createBroadcasterQuery(broadcaster),
				...createPaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixHypeTrainEvent, this._client);
	}

	/**
	 * Creates a paginator for the events of the current or latest Hype Train for the specified broadcaster.
	 *
	 * @param broadcaster The broadcaster to fetch Hype Train events for.
	 */
	getHypeTrainEventsForBroadcasterPaginated(
		broadcaster: UserIdResolvable
	): HelixPaginatedRequest<HelixEventData<HelixHypeTrainEventData, HelixHypeTrainEventType>, HelixHypeTrainEvent> {
		return new HelixPaginatedRequest(
			{
				url: 'hypetrain/events',
				userId: extractUserId(broadcaster),
				scopes: ['channel:read:hype_train'],
				query: createBroadcasterQuery(broadcaster)
			},
			this._client,
			(data: HelixEventData<HelixHypeTrainEventData, HelixHypeTrainEventType>) =>
				new HelixHypeTrainEvent(data, this._client)
		);
	}
}
