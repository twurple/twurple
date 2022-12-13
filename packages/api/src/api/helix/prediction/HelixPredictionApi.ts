import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { rtfm } from '@twurple/common';
import { createGetByIdsQuery } from '../../../interfaces/helix/generic.external';
import {
	createEndPredictionBody,
	createPredictionBody,
	type HelixPredictionData,
	type HelixPredictionStatus
} from '../../../interfaces/helix/prediction.external';
import { type HelixCreatePredictionData } from '../../../interfaces/helix/prediction.input';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixPrediction } from './HelixPrediction';

/**
 * The Helix API methods that deal with predictions.
 *
 * Can be accessed using `client.helix.predictions` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const { data: predictions } = await api.helix.predictions.getPredictions('61369223');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Predictions
 */
@rtfm('api', 'HelixPredictionApi')
export class HelixPredictionApi extends BaseApi {
	/**
	 * Retrieves a list of predictions for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve predictions for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getPredictions(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixPrediction>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixPredictionData>>({
			type: 'helix',
			url: 'predictions',
			scope: 'channel:read:predictions',
			query: {
				...createBroadcasterQuery(broadcaster),
				...createPaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixPrediction, this._client);
	}

	/**
	 * Creates a paginator for predictions for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve predictions for.
	 */
	getPredictionsPaginated(
		broadcaster: UserIdResolvable
	): HelixPaginatedRequest<HelixPredictionData, HelixPrediction> {
		return new HelixPaginatedRequest(
			{
				url: 'predictions',
				scope: 'channel:read:predictions',
				query: createBroadcasterQuery(broadcaster)
			},
			this._client,
			data => new HelixPrediction(data, this._client),
			20
		);
	}

	/**
	 * Retrieves predictions by IDs.
	 *
	 * @param broadcaster The broadcaster to retrieve the predictions for.
	 * @param ids The IDs of the predictions.
	 */
	async getPredictionsByIds(broadcaster: UserIdResolvable, ids: string[]): Promise<HelixPrediction[]> {
		if (!ids.length) {
			return [];
		}

		const result = await this._client.callApi<HelixPaginatedResponse<HelixPredictionData>>({
			type: 'helix',
			url: 'predictions',
			scope: 'channel:read:predictions',
			query: createGetByIdsQuery(broadcaster, ids)
		});

		return result.data.map(data => new HelixPrediction(data, this._client));
	}

	/**
	 * Retrieves a prediction by ID.
	 *
	 * @param broadcaster The broadcaster to retrieve the prediction for.
	 * @param id The ID of the prediction.
	 */
	async getPredictionById(broadcaster: UserIdResolvable, id: string): Promise<HelixPrediction | null> {
		const predictions = await this.getPredictionsByIds(broadcaster, [id]);
		return predictions.length ? predictions[0] : null;
	}

	/**
	 * Creates a new prediction.
	 *
	 * @param broadcaster The broadcaster to create the prediction for.
	 * @param data
	 *
	 * @expandParams
	 */
	async createPrediction(broadcaster: UserIdResolvable, data: HelixCreatePredictionData): Promise<HelixPrediction> {
		const result = await this._client.callApi<HelixResponse<HelixPredictionData>>({
			type: 'helix',
			url: 'predictions',
			method: 'POST',
			scope: 'channel:manage:predictions',
			jsonBody: createPredictionBody(broadcaster, data)
		});

		return new HelixPrediction(result.data[0], this._client);
	}

	/**
	 * Locks a prediction.
	 *
	 * @param broadcaster The broadcaster to lock the prediction for.
	 * @param id The ID of the prediction to lock.
	 */
	async lockPrediction(broadcaster: UserIdResolvable, id: string): Promise<HelixPrediction> {
		return await this._endPrediction(broadcaster, id, 'LOCKED');
	}

	/**
	 * Resolves a prediction.
	 *
	 * @param broadcaster The broadcaster to resolve the prediction for.
	 * @param id The ID of the prediction to resolve.
	 * @param outcomeId The ID of the winning outcome.
	 */
	async resolvePrediction(broadcaster: UserIdResolvable, id: string, outcomeId: string): Promise<HelixPrediction> {
		return await this._endPrediction(broadcaster, id, 'RESOLVED', outcomeId);
	}

	/**
	 * Cancels a prediction.
	 *
	 * @param broadcaster The broadcaster to cancel the prediction for.
	 * @param id The ID of the prediction to cancel.
	 */
	async cancelPrediction(broadcaster: UserIdResolvable, id: string): Promise<HelixPrediction> {
		return await this._endPrediction(broadcaster, id, 'CANCELED');
	}

	private async _endPrediction(
		broadcaster: UserIdResolvable,
		id: string,
		status: HelixPredictionStatus,
		outcomeId?: string
	): Promise<HelixPrediction> {
		const result = await this._client.callApi<HelixResponse<HelixPredictionData>>({
			type: 'helix',
			url: 'predictions',
			method: 'PATCH',
			scope: 'channel:manage:predictions',
			jsonBody: createEndPredictionBody(broadcaster, id, status, outcomeId)
		});

		return new HelixPrediction(result.data[0], this._client);
	}
}
