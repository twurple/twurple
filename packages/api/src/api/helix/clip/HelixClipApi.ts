import type { HelixPaginatedResponse } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import {
	createClipCreateQuery,
	createClipQuery,
	type HelixClipCreateResponse,
	type HelixClipData
} from '../../../interfaces/helix/clip.external';
import {
	type HelixClipCreateParams,
	type HelixClipFilter,
	type HelixClipIdFilter,
	type HelixPaginatedClipFilter,
	type HelixPaginatedClipIdFilter
} from '../../../interfaces/helix/clip.input';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import { createPaginationQuery } from '../HelixPagination';
import { HelixClip } from './HelixClip';

/**
 * The Helix API methods that deal with clips.
 *
 * Can be accessed using `client.clips` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const clipId = await api.clips.createClip({ channelId: '125328655' });
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Clips
 */
@rtfm('api', 'HelixClipApi')
export class HelixClipApi extends BaseApi {
	/**
	 * Retrieves clips for the specified broadcaster in descending order of views.
	 *
	 * @param broadcaster The broadcaster to fetch clips for.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getClipsForBroadcaster(
		broadcaster: UserIdResolvable,
		filter: HelixPaginatedClipFilter = {}
	): Promise<HelixPaginatedResult<HelixClip>> {
		return await this._getClips({
			...filter,
			filterType: 'broadcaster_id',
			ids: extractUserId(broadcaster),
			userId: extractUserId(broadcaster)
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
		filter: HelixClipFilter = {}
	): HelixPaginatedRequest<HelixClipData, HelixClip> {
		return this._getClipsPaginated({
			...filter,
			filterType: 'broadcaster_id',
			ids: extractUserId(broadcaster),
			userId: extractUserId(broadcaster)
		});
	}

	/**
	 * Retrieves clips for the specified game in descending order of views.
	 *
	 * @param gameId The game ID.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getClipsForGame(
		gameId: string,
		filter: HelixPaginatedClipFilter = {}
	): Promise<HelixPaginatedResult<HelixClip>> {
		return await this._getClips({
			...filter,
			filterType: 'game_id',
			ids: gameId
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
		filter: HelixClipFilter = {}
	): HelixPaginatedRequest<HelixClipData, HelixClip> {
		return this._getClipsPaginated({
			...filter,
			filterType: 'game_id',
			ids: gameId
		});
	}

	/**
	 * Retrieves the clips identified by the given IDs.
	 *
	 * @param ids The clip IDs.
	 */
	async getClipsByIds(ids: string[]): Promise<HelixClip[]> {
		const result = await this._getClips({
			filterType: 'id',
			ids
		});

		return result.data;
	}

	/**
	 * Retrieves the clip identified by the given ID.
	 *
	 * @param id The clip ID.
	 */
	async getClipById(id: string): Promise<HelixClip | null> {
		const clips = await this.getClipsByIds([id]);
		return clips.length ? clips[0] : null;
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
			query: createClipCreateQuery(channel, createAfterDelay)
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
				...createPaginationQuery(params)
			}
		});

		return createPaginatedResult(result, HelixClip, this._client);
	}

	private _getClipsPaginated(params: HelixClipIdFilter): HelixPaginatedRequest<HelixClipData, HelixClip> {
		return new HelixPaginatedRequest(
			{
				url: 'clips',
				userId: params.userId,
				query: createClipQuery(params)
			},
			this._client,
			data => new HelixClip(data, this._client)
		);
	}
}
