import { createBroadcasterQuery, type HelixPaginatedResponse, type HelixResponse } from '@twurple/api-call';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import { createGetByIdsQuery } from '../../interfaces/endpoints/generic.external.js';
import { createPollBody, createPollEndBody, type HelixPollData } from '../../interfaces/endpoints/poll.external.js';
import { type HelixCreatePollData } from '../../interfaces/endpoints/poll.input.js';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest.js';
import { createPaginatedResult, type HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult.js';
import { createPaginationQuery, type HelixForwardPagination } from '../../utils/pagination/HelixPagination.js';
import { BaseApi } from '../BaseApi.js';
import { HelixPoll } from './HelixPoll.js';

/**
 * The Helix API methods that deal with polls.
 *
 * Can be accessed using `client.polls` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const { data: polls } = await api.helix.polls.getPolls('61369223');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Polls
 */
@rtfm('api', 'HelixPollApi')
export class HelixPollApi extends BaseApi {
	/**
	 * Gets a list of polls for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get polls for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getPolls(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination,
	): Promise<HelixPaginatedResult<HelixPoll>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixPollData>>({
			type: 'helix',
			url: 'polls',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:polls', 'channel:manage:polls'],
			query: {
				...createBroadcasterQuery(broadcaster),
				...createPaginationQuery(pagination),
			},
		});

		return createPaginatedResult(result, HelixPoll, this._client);
	}

	/**
	 * Creates a paginator for polls for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get polls for.
	 */
	getPollsPaginated(broadcaster: UserIdResolvable): HelixPaginatedRequest<HelixPollData, HelixPoll> {
		return new HelixPaginatedRequest(
			{
				url: 'polls',
				userId: extractUserId(broadcaster),
				scopes: ['channel:read:polls', 'channel:manage:polls'],
				query: createBroadcasterQuery(broadcaster),
			},
			this._client,
			data => new HelixPoll(data, this._client),
			20,
		);
	}

	/**
	 * Gets polls by IDs.
	 *
	 * @param broadcaster The broadcaster to get the polls for.
	 * @param ids The IDs of the polls.
	 */
	async getPollsByIds(broadcaster: UserIdResolvable, ids: string[]): Promise<HelixPoll[]> {
		if (!ids.length) {
			return [];
		}

		const result = await this._client.callApi<HelixPaginatedResponse<HelixPollData>>({
			type: 'helix',
			url: 'polls',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:polls', 'channel:manage:polls'],
			query: createGetByIdsQuery(broadcaster, ids),
		});

		return result.data.map(data => new HelixPoll(data, this._client));
	}

	/**
	 * Gets a poll by ID.
	 *
	 * @param broadcaster The broadcaster to get the poll for.
	 * @param id The ID of the poll.
	 */
	async getPollById(broadcaster: UserIdResolvable, id: string): Promise<HelixPoll | null> {
		const polls = await this.getPollsByIds(broadcaster, [id]);
		return polls.length ? polls[0] : null;
	}

	/**
	 * Creates a new poll.
	 *
	 * @param broadcaster The broadcaster to create the poll for.
	 * @param data
	 *
	 * @expandParams
	 */
	async createPoll(broadcaster: UserIdResolvable, data: HelixCreatePollData): Promise<HelixPoll> {
		const result = await this._client.callApi<HelixResponse<HelixPollData>>({
			type: 'helix',
			url: 'polls',
			method: 'POST',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:polls'],
			jsonBody: createPollBody(broadcaster, data),
		});

		return new HelixPoll(result.data[0], this._client);
	}

	/**
	 * Ends a poll.
	 *
	 * @param broadcaster The broadcaster to end the poll for.
	 * @param id The ID of the poll to end.
	 * @param showResult Whether to allow the result to be viewed publicly.
	 */
	async endPoll(broadcaster: UserIdResolvable, id: string, showResult = true): Promise<HelixPoll> {
		const result = await this._client.callApi<HelixResponse<HelixPollData>>({
			type: 'helix',
			url: 'polls',
			method: 'PATCH',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:polls'],
			jsonBody: createPollEndBody(broadcaster, id, showResult),
		});

		return new HelixPoll(result.data[0], this._client);
	}
}
