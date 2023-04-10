import type { HelixPaginatedResponse } from '@twurple/api-call';
import { rtfm } from '@twurple/common';
import { type HelixGameData } from '../../interfaces/endpoints/game.external';
import {
	createSearchChannelsQuery,
	type HelixChannelSearchResultData
} from '../../interfaces/endpoints/search.external';
import {
	type HelixChannelSearchFilter,
	type HelixPaginatedChannelSearchFilter
} from '../../interfaces/endpoints/search.input';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import type { HelixForwardPagination } from '../../utils/pagination/HelixPagination';
import { createPaginationQuery } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixGame } from '../game/HelixGame';
import { HelixChannelSearchResult } from './HelixChannelSearchResult';

/**
 * The Helix API methods that run searches.
 *
 * Can be accessed using `client.search` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const channels = await api.search.searchChannels('pear');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Search
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
				...createPaginationQuery(pagination)
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
				...createSearchChannelsQuery(query, filter),
				...createPaginationQuery(filter)
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
				query: createSearchChannelsQuery(query, filter)
			},
			this._client,
			data => new HelixChannelSearchResult(data, this._client)
		);
	}
}
