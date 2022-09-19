import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPollData } from './HelixPoll';
import { HelixPoll } from './HelixPoll';

/**
 * Data to create a new poll.
 */
export interface HelixCreatePollData {
	/**
	 * The title of the poll.
	 */
	title: string;

	/**
	 * The available choices for the poll.
	 */
	choices: string[];

	/**
	 * The duration of the poll, in seconds.
	 */
	duration: number;

	/**
	 * The number of bits that a vote should cost. If not given, voting with bits will be disabled.
	 */
	bitsPerVote?: number;

	/**
	 * The number of channel points that a vote should cost. If not given, voting with channel points will be disabled.
	 */
	channelPointsPerVote?: number;
}

/**
 * The Helix API methods that deal with polls.
 *
 * Can be accessed using `client.helix.polls` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const { data: polls } = await api.helix.polls.getPolls('61369223');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Polls
 */
@rtfm('api', 'HelixPollApi')
export class HelixPollApi extends BaseApi {
	/**
	 * Retrieves a list of polls for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve polls for.
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
			scope: 'channel:read:polls',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				...makePaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixPoll, this._client);
	}

	/**
	 * Creates a paginator for polls for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve polls for.
	 */
	getPollsPaginated(broadcaster: UserIdResolvable): HelixPaginatedRequest<HelixPollData, HelixPoll> {
		return new HelixPaginatedRequest(
			{
				url: 'polls',
				scope: 'channel:read:polls',
				query: {
					broadcaster_id: extractUserId(broadcaster)
				}
			},
			this._client,
			data => new HelixPoll(data, this._client),
			20
		);
	}

	/**
	 * Retrieves polls by IDs.
	 *
	 * @param broadcaster The broadcaster to retrieve the polls for.
	 * @param ids The IDs of the polls.
	 */
	async getPollsByIds(broadcaster: UserIdResolvable, ids: string[]): Promise<HelixPoll[]> {
		if (!ids.length) {
			return [];
		}

		const result = await this._client.callApi<HelixPaginatedResponse<HelixPollData>>({
			type: 'helix',
			url: 'polls',
			scope: 'channel:read:polls',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				id: ids
			}
		});

		return result.data.map(data => new HelixPoll(data, this._client));
	}

	/**
	 * Retrieves a poll by ID.
	 *
	 * @param broadcaster The broadcaster to retrieve the poll for.
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
			scope: 'channel:manage:polls',
			jsonBody: {
				broadcaster_id: extractUserId(broadcaster),
				title: data.title,
				choices: data.choices.map(title => ({ title })),
				duration: data.duration,
				bits_voting_enabled: data.bitsPerVote != null,
				bits_per_vote: data.bitsPerVote ?? 0,
				channel_points_voting_enabled: data.channelPointsPerVote != null,
				channel_points_per_vote: data.channelPointsPerVote ?? 0
			}
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
			scope: 'channel:manage:polls',
			jsonBody: {
				broadcaster_id: extractUserId(broadcaster),
				id,
				status: showResult ? 'TERMINATED' : 'ARCHIVED'
			}
		});

		return new HelixPoll(result.data[0], this._client);
	}
}
