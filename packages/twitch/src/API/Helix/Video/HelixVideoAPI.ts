import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import { TwitchAPICallType } from '../../../TwitchClient';
import BaseAPI from '../../BaseAPI';
import HelixPaginatedRequest from '../HelixPaginatedRequest';
import HelixPaginatedResult from '../HelixPaginatedResult';
import HelixPagination, { makePaginationQuery } from '../HelixPagination';
import { HelixPaginatedResponse } from '../HelixResponse';
import HelixVideo, { HelixVideoData, HelixVideoType } from './HelixVideo';

/** @private */
export type HelixVideoFilterType = 'id' | 'user_id' | 'game_id';

/** @private */
export type HelixVideoFilterPeriod = 'all' | 'day' | 'week' | 'month';

/** @private */
export type HelixVideoSort = 'time' | 'trending' | 'views';

/**
 * Filters for the videos request.
 */
export interface HelixVideoFilter {
	/**
	 * The language of the videos.
	 */
	language?: string;

	/**
	 * The period of time when the videos were created.
	 */
	period?: HelixVideoFilterPeriod;

	/**
	 * The value to order the videos by.
	 */
	orderBy?: HelixVideoSort;

	/**
	 * The type of the videos.
	 */
	type?: HelixVideoType | 'all';
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedVideoFilter extends HelixVideoFilter, HelixPagination {}

/**
 * The Helix API methods that deal with videos.
 *
 * Can be accessed using `client.helix.videos` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const videos = await client.helix.videos.getVideosByUser('125328655');
 * ```
 */
export default class HelixVideoAPI extends BaseAPI {
	/**
	 * Retrieves the video data for the given list of video IDs.
	 *
	 * @param ids The video IDs you want to look up.
	 */
	async getVideosByIds(ids: string | string[]) {
		const result = await this._getVideos('id', ids);

		return result.data;
	}

	/**
	 * Retrieves the video data for the given video ID.
	 *
	 * @param id The video ID you want to look up.
	 */
	async getVideoById(id: string) {
		const videos = await this.getVideosByIds(id);
		return videos.length ? videos[0] : null;
	}

	/**
	 * Retrieves the videos of the given user.
	 *
	 * @param user The user you want to retrieve videos from.
	 * @param filter Additional filters for the result set.
	 */
	async getVideosByUser(user: UserIdResolvable, filter: HelixPaginatedVideoFilter = {}) {
		const userId = extractUserId(user);
		return this._getVideos('user_id', userId, filter);
	}

	/**
	 * Creates a paginator for videos of the given user.
	 *
	 * @param user The user you want to retrieve videos from.
	 * @param filter Additional filters for the result set.
	 */
	getVideosByUserPaginated(user: UserIdResolvable, filter: HelixVideoFilter = {}) {
		const userId = extractUserId(user);
		return this._getVideosPaginated('user_id', userId, filter);
	}

	/**
	 * Retrieves the videos of the given game.
	 *
	 * @param gameId The game you want to retrieve videos from.
	 * @param filter Additional filters for the result set.
	 */
	async getVideosByGame(gameId: string, filter: HelixVideoFilter = {}) {
		return this._getVideos('game_id', gameId, filter);
	}

	/**
	 * Creates a paginator for videos of the given game.
	 *
	 * @param gameId The game you want to retrieve videos from.
	 * @param filter Additional filters for the result set.
	 */
	getVideosByGamePaginated(gameId: string, filter: HelixVideoFilter = {}) {
		return this._getVideosPaginated('game_id', gameId, filter);
	}

	private async _getVideos(
		filterType: HelixVideoFilterType,
		filterValues: string | string[],
		filter: HelixPaginatedVideoFilter = {}
	): Promise<HelixPaginatedResult<HelixVideo>> {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixVideoData>>({
			url: 'videos',
			type: TwitchAPICallType.Helix,
			query: {
				...HelixVideoAPI._makeVideosQuery(filterType, filterValues, filter),
				...makePaginationQuery(filter)
			}
		});

		return {
			data: result.data.map(data => new HelixVideo(data, this._client)),
			cursor: result.pagination && result.pagination.cursor
		};
	}

	private _getVideosPaginated(
		filterType: HelixVideoFilterType,
		filterValues: string | string[],
		filter: HelixVideoFilter = {}
	) {
		return new HelixPaginatedRequest(
			{
				url: 'videos',
				query: HelixVideoAPI._makeVideosQuery(filterType, filterValues, filter)
			},
			this._client,
			(data: HelixVideoData) => new HelixVideo(data, this._client)
		);
	}

	private static _makeVideosQuery(
		filterType: HelixVideoFilterType,
		filterValues: string | string[],
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
