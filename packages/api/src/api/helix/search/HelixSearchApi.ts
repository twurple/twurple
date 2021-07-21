import { rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import type { HelixGameData } from '../game/HelixGame';
import { HelixGame } from '../game/HelixGame';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponse } from '../HelixResponse';
import type { HelixChannelSearchResultData } from './HelixChannelSearchResult';
import { HelixChannelSearchResult } from './HelixChannelSearchResult';

/**
 * Filters for a channel search.
 */
export interface HelixChannelSearchFilter {
	/**
	 * Include only channels that are currently live.
	 */
	liveOnly?: boolean;
}

/** @inheritDoc */
export interface HelixPaginatedChannelSearchFilter extends HelixChannelSearchFilter, HelixForwardPagination {}

/**
 * The Helix API methods that run searches.
 *
 * Can be accessed using `client.search` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const channels = await api.search.searchChannels('pear');
 * ```
 */
@rtfm('api', 'HelixSearchApi')
export class HelixSearchApi extends BaseApi {
	/**
	 * Search categories/games for an exact or partial match.
	 *
	 * @param query The search term.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async searchCategories(
		query: string,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixGame>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixGameData>>({
			type: 'helix',
			url: 'search/categories',
			query: {
				query,
				...makePaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixGame, this._client);
	}

	/**
	 * Creates a paginator for a category/game search.
	 *
	 * @param query The search term.
	 */
	searchCategoriesPaginated(query: string): HelixPaginatedRequest<HelixGameData, HelixGame> {
		return new HelixPaginatedRequest(
			{
				url: 'search/categories',
				query: {
					query
				}
			},
			this._client,
			data => new HelixGame(data, this._client)
		);
	}

	/**
	 * Search channels for an exact or partial match.
	 *
	 * @param query The search term.
	 * @param filter
	 *
	 * @expandParams
	 */
	async searchChannels(
		query: string,
		filter: HelixPaginatedChannelSearchFilter = {}
	): Promise<HelixPaginatedResult<HelixChannelSearchResult>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixChannelSearchResultData>>({
			type: 'helix',
			url: 'search/channels',
			query: {
				query,
				live_only: filter.liveOnly?.toString(),
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixChannelSearchResult, this._client);
	}

	/**
	 * Creates a paginator for a channel search.
	 *
	 * @param query The search term.
	 * @param filter
	 *
	 * @expandParams
	 */
	searchChannelsPaginated(
		query: string,
		filter: HelixChannelSearchFilter = {}
	): HelixPaginatedRequest<HelixChannelSearchResultData, HelixChannelSearchResult> {
		return new HelixPaginatedRequest(
			{
				url: 'search/channels',
				query: {
					query,
					live_only: filter.liveOnly?.toString()
				}
			},
			this._client,
			data => new HelixChannelSearchResult(data, this._client)
		);
	}
}
