import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponse } from '../HelixResponse';
import type { HelixClipData } from './HelixClip';
import { HelixClip } from './HelixClip';

/** @private */
export type HelixClipFilterType = 'broadcaster_id' | 'game_id' | 'id';

/**
 * Filters for clip queries.
 */
export interface HelixClipFilter {
	/**
	 * The earliest date to find clips for.
	 */
	startDate?: string;
	/**
	 * The latest date to find clips for.
	 */
	endDate?: string;
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedClipFilter extends HelixClipFilter, HelixPagination {}

/** @private */
export interface HelixClipIdFilterPart {
	filterType: HelixClipFilterType;
	ids: string | string[];
}

/** @private */
export interface HelixClipIdFilter extends HelixClipFilter, HelixClipIdFilterPart {}

/** @private */
export interface HelixPaginatedClipIdFilter extends HelixPaginatedClipFilter, HelixClipIdFilterPart {}

/**
 * Parameters for creating a clip.
 */
export interface HelixClipCreateParams {
	/**
	 * The ID of the broadcaster of which you want to create a clip.
	 */
	channelId: string;

	/**
	 * Add a delay before the clip creation that accounts for the usual delay in the viewing experience.
	 */
	createAfterDelay?: boolean;
}

/** @private */
export interface HelixClipCreateResponse {
	id: string;
	edit_url: string;
}

/**
 * The Helix API methods that deal with clips.
 *
 * Can be accessed using `client.clips` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const clipId = await api.clips.createClip({ channelId: '125328655' });
 * ```
 */
@rtfm('api', 'HelixClipApi')
export class HelixClipApi extends BaseApi {
	/**
	 * Retrieves the latest clips for the specified broadcaster.
	 *
	 * @param user The broadcaster to fetch clips for.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getClipsForBroadcaster(
		user: UserIdResolvable,
		filter: HelixPaginatedClipFilter = {}
	): Promise<HelixPaginatedResult<HelixClip>> {
		return await this._getClips({
			...filter,
			filterType: 'broadcaster_id',
			ids: extractUserId(user)
		});
	}

	/**
	 * Creates a paginator for the latest clips for the specified broadcaster.
	 *
	 * @param user The broadcaster to fetch clips for.
	 * @param filter
	 *
	 * @expandParams
	 */
	getClipsForBroadcasterPaginated(
		user: UserIdResolvable,
		filter: HelixClipFilter = {}
	): HelixPaginatedRequest<HelixClipData, HelixClip> {
		return this._getClipsPaginated({
			...filter,
			filterType: 'broadcaster_id',
			ids: extractUserId(user)
		});
	}

	/**
	 * Retrieves the latest clips for the specified game.
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
	 * Creates a paginator for the latest clips for the specified game.
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
	 * @expandParams
	 */
	async createClip(params: HelixClipCreateParams): Promise<string> {
		const { channelId, createAfterDelay = false } = params;
		const result = await this._client.callApi<{ data: [HelixClipCreateResponse] }>({
			type: 'helix',
			url: 'clips',
			method: 'POST',
			scope: 'clips:edit',
			query: {
				broadcaster_id: channelId,
				has_delay: createAfterDelay.toString()
			}
		});

		return result.data[0].id;
	}

	private async _getClips(params: HelixPaginatedClipIdFilter): Promise<HelixPaginatedResult<HelixClip>> {
		const { filterType, ids, startDate, endDate, ...pagination } = params;

		if (!ids.length) {
			return { data: [] };
		}

		const result = await this._client.callApi<HelixPaginatedResponse<HelixClipData>>({
			type: 'helix',
			url: 'clips',
			query: {
				[filterType]: ids,
				started_at: startDate,
				ended_at: endDate,
				...makePaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixClip, this._client);
	}

	private _getClipsPaginated(params: HelixClipIdFilter): HelixPaginatedRequest<HelixClipData, HelixClip> {
		const { filterType, ids, startDate, endDate } = params;

		return new HelixPaginatedRequest(
			{
				url: 'clips',
				query: {
					[filterType]: ids,
					started_at: startDate,
					ended_at: endDate
				}
			},
			this._client,
			data => new HelixClip(data, this._client)
		);
	}
}
