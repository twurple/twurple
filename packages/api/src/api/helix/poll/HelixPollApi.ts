import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { createGetByIdsQuery } from '../../../interfaces/helix/generic.external';
import { createPollBody, createPollEndBody, type HelixPollData } from '../../../interfaces/helix/poll.external';
import { type HelixCreatePollData } from '../../../interfaces/helix/poll.input';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixPoll } from './HelixPoll';

/**
 * The Helix API methods that deal with polls.
 *
 * Can be accessed using `client.helix.polls` on an {@link ApiClient} instance.
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
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixPoll>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixPollData>>({
			type: 'helix',
			url: 'polls',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:polls'],
			query: {
				...createBroadcasterQuery(broadcaster),
				...createPaginationQuery(pagination)
			}
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
				scopes: ['channel:read:polls'],
				query: createBroadcasterQuery(broadcaster)
			},
			this._client,
			data => new HelixPoll(data, this._client),
			20
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
			scopes: ['channel:read:polls'],
			query: createGetByIdsQuery(broadcaster, ids)
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
			jsonBody: createPollBody(broadcaster, data)
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
			jsonBody: createPollEndBody(broadcaster, id, showResult)
		});

		return new HelixPoll(result.data[0], this._client);
	}
}
