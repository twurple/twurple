import { TwitchApiCallType } from 'twitch-api-call';
import type { UserIdResolvable } from 'twitch-common';
import { extractUserId } from 'twitch-common';
import { BaseApi } from '../../BaseApi';
import type { HelixEventData } from '../HelixEvent';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import type { HelixPaginatedResponse } from '../HelixResponse';
import type { HelixHypeTrainEventData, HelixHypeTrainEventType } from './HelixHypeTrainEvent';
import { HelixHypeTrainEvent } from './HelixHypeTrainEvent';

/**
 * The Helix API methods that deal with Hype Trains.
 *
 * Can be accessed using `client.helix.hypeTrain` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const { data: events } = await api.helix.hypeTrain.getHypeTrainEventsForBroadcaster('125328655');
 * ```
 */
export class HelixHypeTrainApi extends BaseApi {
	/**
	 * Retrieves the events of the current or latest Hype Train for the specified broadcaster.
	 *
	 * @param broadcaster The broadcaster to fetch Hype Train events for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getHypeTrainEventsForBroadcaster(
		broadcaster: UserIdResolvable,
		pagination: HelixForwardPagination = {}
	): Promise<HelixPaginatedResult<HelixHypeTrainEvent>> {
		const { after, limit = '20' } = pagination;

		const result = await this._client.callApi<
			HelixPaginatedResponse<HelixEventData<HelixHypeTrainEventData, HelixHypeTrainEventType>>
		>({
			type: TwitchApiCallType.Helix,
			url: 'hypetrain/events',
			scope: 'channel:read:hype_train',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				after,
				first: limit
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
				scope: 'channel:read:hype_train',
				query: {
					broadcaster_id: extractUserId(broadcaster)
				}
			},
			this._client,
			(data: HelixEventData<HelixHypeTrainEventData, HelixHypeTrainEventType>) =>
				new HelixHypeTrainEvent(data, this._client)
		);
	}

	/**
	 * Retrieves a single Hype Train event by ID.
	 *
	 * @param id The ID of the Hype Train event.
	 */
	async getHypeTrainEventById(id: string): Promise<HelixHypeTrainEvent | null> {
		const result = await this._client.callApi<
			HelixPaginatedResponse<HelixEventData<HelixHypeTrainEventData, HelixHypeTrainEventType>>
		>({
			type: TwitchApiCallType.Helix,
			url: 'hypetrain/events',
			scope: 'channel:read:hype_train',
			query: {
				id
			}
		});

		return result.data.length ? new HelixHypeTrainEvent(result.data[0], this._client) : null;
	}
}
