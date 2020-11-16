import { TwitchApiCallType } from 'twitch-api-call';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponse, HelixResponse } from '../HelixResponse';
import type { HelixTagData } from './HelixTag';
import { HelixTag } from './HelixTag';

/**
 * The Helix API methods that deal with tags.
 *
 * Can be accessed using `client.helix.tags` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const tags = await api.helix.tags.getAllStreamTags();
 * ```
 */
export class HelixTagApi extends BaseApi {
	/**
	 * Retrieves all stream tags.
	 *
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getAllStreamTags(pagination: HelixForwardPagination = {}): Promise<HelixPaginatedResult<HelixTag>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixTagData>>({
			type: TwitchApiCallType.Helix,
			url: 'tags/streams',
			query: makePaginationQuery(pagination)
		});

		return createPaginatedResult(result, HelixTag, this._client);
	}

	/**
	 * Creates a paginator for all stream tags.
	 */
	getAllStreamTagsPaginated(): HelixPaginatedRequest<HelixTagData, HelixTag> {
		return new HelixPaginatedRequest<HelixTagData, HelixTag>(
			{
				url: 'tags/streams'
			},
			this._client,
			data => new HelixTag(data, this._client)
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
			type: TwitchApiCallType.Helix,
			url: 'tags/streams',
			query: {
				tag_id: ids
			}
		});

		return result.data.map(data => new HelixTag(data, this._client));
	}

	/**
	 * Retrieves a single stream tag by ID.
	 *
	 * @param id The ID of the stream tag.
	 */
	async getStreamTagById(id: string): Promise<HelixTag | null> {
		const tags = await this.getStreamTagsByIds([id]);
		return tags.length ? tags[0] : null;
	}
}
