import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { rtfm } from '@twurple/common';
import { createSingleKeyQuery } from '../../../interfaces/helix/generic.external';
import { type HelixTagData } from '../../../interfaces/helix/tag.external';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixTag } from './HelixTag';

/**
 * The Helix API methods that deal with tags.
 *
 * Can be accessed using `client.tags` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const tags = await api.tags.getAllStreamTags();
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Tags
 */
@rtfm('api', 'HelixTagApi')
export class HelixTagApi extends BaseApi {
	/**
	 * Retrieves all stream tags.
	 *
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getAllStreamTags(pagination?: HelixForwardPagination): Promise<HelixPaginatedResult<HelixTag>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixTagData>>({
			type: 'helix',
			url: 'tags/streams',
			query: createPaginationQuery(pagination)
		});

		return createPaginatedResult(result, HelixTag);
	}

	/**
	 * Creates a paginator for all stream tags.
	 */
	getAllStreamTagsPaginated(): HelixPaginatedRequest<HelixTagData, HelixTag> {
		return new HelixPaginatedRequest(
			{
				url: 'tags/streams'
			},
			this._client,
			data => new HelixTag(data)
		);
	}

	/**
	 * Retrieves a set of stream tags by IDs.
	 *
	 * @param ids The IDs of the stream tags.
	 */
	async getStreamTagsByIds(ids: string[]): Promise<HelixTag[]> {
		if (!ids.length) {
			return [];
		}
		const result = await this._client.callApi<HelixResponse<HelixTagData>>({
			type: 'helix',
			url: 'tags/streams',
			query: createSingleKeyQuery('tag_id', ids)
		});

		return result.data.map(data => new HelixTag(data));
	}

	/**
	 * Retrieves a single stream tag by ID.
	 *
	 * @param id The ID of the stream tag.
	 */
	async getStreamTagById(id: string): Promise<HelixTag | null> {
		const tags = await this.getStreamTagsByIds([id]);
		return tags[0] ?? null;
	}
}
