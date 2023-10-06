import { Enumerable } from '@d-fischer/shared-utils';
import type { HelixPaginatedResponse } from '@twurple/api-call';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import {
	createClipCreateQuery,
	createClipQuery,
	type HelixClipCreateResponse,
	type HelixClipData,
} from '../../interfaces/endpoints/clip.external';
import {
	type HelixClipCreateParams,
	type HelixClipFilter,
	type HelixClipIdFilter,
	type HelixPaginatedClipFilter,
	type HelixPaginatedClipIdFilter,
} from '../../interfaces/endpoints/clip.input';
import { HelixRequestBatcher } from '../../utils/HelixRequestBatcher';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import { createPaginatedResult, type HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginationQuery } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixClip } from './HelixClip';

/**
 * The Helix API methods that deal with clips.
 *
 * Can be accessed using `client.clips` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const clipId = await api.clips.createClip({ channel: '125328655' });
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Clips
 */
@rtfm('api', 'HelixClipApi')
export class HelixClipApi extends BaseApi {
	/** @internal */
	@Enumerable(false) private readonly _getClipByIdBatcher = new HelixRequestBatcher(
		{
			url: 'clips',
		},
		'id',
		'id',
		this._client,
		(data: HelixClipData) => new HelixClip(data, this._client),
	);

	/**
	 * Gets clips for the specified broadcaster in descending order of views.
	 *
	 * @param broadcaster The broadcaster to fetch clips for.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getClipsForBroadcaster(
		broadcaster: UserIdResolvable,
		filter: HelixPaginatedClipFilter = {},
	): Promise<HelixPaginatedResult<HelixClip>> {
		return await this._getClips({
			...filter,
			filterType: 'broadcaster_id',
			ids: extractUserId(broadcaster),
			userId: extractUserId(broadcaster),
		});
	}

	/**
	 * Creates a paginator for clips for the specified broadcaster.
	 *
	 * @param broadcaster The broadcaster to fetch clips for.
	 * @param filter
	 *
	 * @expandParams
	 */
	getClipsForBroadcasterPaginated(
		broadcaster: UserIdResolvable,
		filter: HelixClipFilter = {},
	): HelixPaginatedRequest<HelixClipData, HelixClip> {
		return this._getClipsPaginated({
			...filter,
			filterType: 'broadcaster_id',
			ids: extractUserId(broadcaster),
			userId: extractUserId(broadcaster),
		});
	}

	/**
	 * Gets clips for the specified game in descending order of views.
	 *
	 * @param gameId The game ID.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getClipsForGame(
		gameId: string,
		filter: HelixPaginatedClipFilter = {},
	): Promise<HelixPaginatedResult<HelixClip>> {
		return await this._getClips({
			...filter,
			filterType: 'game_id',
			ids: gameId,
		});
	}

	/**
	 * Creates a paginator for clips for the specified game.
	 *
	 * @param gameId The game ID.
	 * @param filter
	 *
	 * @expandParams
	 */
	getClipsForGamePaginated(
		gameId: string,
		filter: HelixClipFilter = {},
	): HelixPaginatedRequest<HelixClipData, HelixClip> {
		return this._getClipsPaginated({
			...filter,
			filterType: 'game_id',
			ids: gameId,
		});
	}

	/**
	 * Gets the clips identified by the given IDs.
	 *
	 * @param ids The clip IDs.
	 */
	async getClipsByIds(ids: string[]): Promise<HelixClip[]> {
		const result = await this._getClips({
			filterType: 'id',
			ids,
		});

		return result.data;
	}

	/**
	 * Gets the clip identified by the given ID.
	 *
	 * @param id The clip ID.
	 */
	async getClipById(id: string): Promise<HelixClip | null> {
		const clips = await this.getClipsByIds([id]);
		return clips.length ? clips[0] : null;
	}

	/**
	 * Gets the clip identified by the given ID, batching multiple calls into fewer requests as the API allows.
	 *
	 * @param id The clip ID.
	 */
	async getClipByIdBatched(id: string): Promise<HelixClip | null> {
		return await this._getClipByIdBatcher.request(id);
	}

	/**
	 * Creates a clip of a running stream.
	 *
	 * Returns the ID of the clip.
	 *
	 * @param params
	 * @expandParams
	 */
	async createClip(params: HelixClipCreateParams): Promise<string> {
		const { channel, createAfterDelay = false } = params;
		const result = await this._client.callApi<{ data: [HelixClipCreateResponse] }>({
			type: 'helix',
			url: 'clips',
			method: 'POST',
			userId: extractUserId(channel),
			scopes: ['clips:edit'],
			canOverrideScopedUserContext: true,
			query: createClipCreateQuery(channel, createAfterDelay),
		});

		return result.data[0].id;
	}

	private async _getClips(params: HelixPaginatedClipIdFilter): Promise<HelixPaginatedResult<HelixClip>> {
		if (!params.ids.length) {
			return { data: [] };
		}

		const result = await this._client.callApi<HelixPaginatedResponse<HelixClipData>>({
			type: 'helix',
			url: 'clips',
			userId: params.userId,
			query: {
				...createClipQuery(params),
				...createPaginationQuery(params),
			},
		});

		return createPaginatedResult(result, HelixClip, this._client);
	}

	private _getClipsPaginated(params: HelixClipIdFilter): HelixPaginatedRequest<HelixClipData, HelixClip> {
		return new HelixPaginatedRequest(
			{
				url: 'clips',
				userId: params.userId,
				query: createClipQuery(params),
			},
			this._client,
			data => new HelixClip(data, this._client),
		);
	}
}
