import type { HelixPaginatedResponse } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { type HelixVideoData } from '../../../interfaces/helix/video.external';
import { type HelixPaginatedVideoFilter, type HelixVideoFilter } from '../../../interfaces/helix/video.input';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import { createPaginationQuery } from '../HelixPagination';
import { HelixVideo } from './HelixVideo';

/** @private */
export type HelixVideoFilterType = 'id' | 'user_id' | 'game_id';

/**
 * The Helix API methods that deal with videos.
 *
 * Can be accessed using `client.videos` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const { data: videos } = await api.videos.getVideosByUser('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Videos
 */
@rtfm('api', 'HelixVideoApi')
export class HelixVideoApi extends BaseApi {
	/**
	 * Retrieves the video data for the given list of video IDs.
	 *
	 * @param ids The video IDs you want to look up.
	 */
	async getVideosByIds(ids: string[]): Promise<HelixVideo[]> {
		const result = await this._getVideos('id', ids);

		return result.data;
	}

	/**
	 * Retrieves the video data for the given video ID.
	 *
	 * @param id The video ID you want to look up.
	 */
	async getVideoById(id: string): Promise<HelixVideo | null> {
		const videos = await this.getVideosByIds([id]);
		return videos.length ? videos[0] : null;
	}

	/**
	 * Retrieves the videos of the given user.
	 *
	 * @param user The user you want to retrieve videos from.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getVideosByUser(
		user: UserIdResolvable,
		filter: HelixPaginatedVideoFilter = {}
	): Promise<HelixPaginatedResult<HelixVideo>> {
		const userId = extractUserId(user);
		return await this._getVideos('user_id', [userId], filter);
	}

	/**
	 * Creates a paginator for videos of the given user.
	 *
	 * @param user The user you want to retrieve videos from.
	 * @param filter
	 *
	 * @expandParams
	 */
	getVideosByUserPaginated(
		user: UserIdResolvable,
		filter: HelixVideoFilter = {}
	): HelixPaginatedRequest<HelixVideoData, HelixVideo> {
		const userId = extractUserId(user);
		return this._getVideosPaginated('user_id', [userId], filter);
	}

	/**
	 * Retrieves the videos of the given game.
	 *
	 * @param gameId The game you want to retrieve videos from.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getVideosByGame(
		gameId: string,
		filter: HelixPaginatedVideoFilter = {}
	): Promise<HelixPaginatedResult<HelixVideo>> {
		return await this._getVideos('game_id', [gameId], filter);
	}

	/**
	 * Creates a paginator for videos of the given game.
	 *
	 * @param gameId The game you want to retrieve videos from.
	 * @param filter
	 *
	 * @expandParams
	 */
	getVideosByGamePaginated(
		gameId: string,
		filter: HelixVideoFilter = {}
	): HelixPaginatedRequest<HelixVideoData, HelixVideo> {
		return this._getVideosPaginated('game_id', [gameId], filter);
	}

	/**
	 * Deletes videos by its IDs.
	 *
	 * @param ids The IDs of the videos to delete.
	 */
	async deleteVideosByIds(ids: string[]): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'videos',
			method: 'DELETE',
			scope: 'channel:manage:videos',
			query: {
				id: ids
			}
		});
	}

	private async _getVideos(
		filterType: HelixVideoFilterType,
		filterValues: string[],
		filter: HelixPaginatedVideoFilter = {}
	): Promise<HelixPaginatedResult<HelixVideo>> {
		if (!filterValues.length) {
			return { data: [] };
		}
		const result = await this._client.callApi<HelixPaginatedResponse<HelixVideoData>>({
			type: 'helix',
			url: 'videos',
			userId: filterType === 'user_id' ? filterValues[0] : undefined,
			query: {
				...HelixVideoApi._makeVideosQuery(filterType, filterValues, filter),
				...createPaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixVideo, this._client);
	}

	private _getVideosPaginated(
		filterType: HelixVideoFilterType,
		filterValues: string[],
		filter: HelixVideoFilter = {}
	): HelixPaginatedRequest<HelixVideoData, HelixVideo> {
		return new HelixPaginatedRequest(
			{
				url: 'videos',
				userId: filterType === 'user_id' ? filterValues[0] : undefined,
				query: HelixVideoApi._makeVideosQuery(filterType, filterValues, filter)
			},
			this._client,
			data => new HelixVideo(data, this._client)
		);
	}

	private static _makeVideosQuery(
		filterType: HelixVideoFilterType,
		filterValues: string[],
		filter: HelixVideoFilter = {}
	) {
		const { language, period, orderBy, type } = filter;
		return {
			[filterType]: filterValues,
			language,
			period,
			sort: orderBy,
			type
		};
	}
}
