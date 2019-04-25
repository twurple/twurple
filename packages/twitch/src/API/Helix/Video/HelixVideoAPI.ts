import BaseAPI from '../../BaseAPI';
import { TwitchAPICallType } from '../../../TwitchClient';
import { HelixPaginatedResponse } from '../HelixResponse';
import HelixVideo, { HelixVideoData, HelixVideoType } from './HelixVideo';
import HelixPagination from '../HelixPagination';
import { extractUserId, UserIdResolvable } from '../../../Toolkit/UserTools';
import HelixPaginatedRequest from '../HelixPaginatedRequest';

/** @private */
export type HelixVideoFilterType = 'user_id' | 'game_id';

/** @private */
export type HelixVideoFilterPeriod = 'all' | 'day' | 'week' | 'month';

/** @private */
export type HelixVideoSort = 'time' | 'trending' | 'views';

/**
 * Filters for the videos request.
 */
export interface HelixVideoFilter extends HelixPagination {
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
 * The Helix API methods that deal with videos.
 *
 * Can be accessed using `client.helix.videos` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = await TwitchClient.withCredentials(clientId, accessToken);
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
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixVideoData>>({
			type: TwitchAPICallType.Helix,
			url: 'videos',
			query: {
				id: ids
			}
		});

		return result.data.map(data => new HelixVideo(data, this._client));
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
	getVideosByUser(user: UserIdResolvable, filter: HelixVideoFilter = {}) {
		const userId = extractUserId(user);
		return this._getVideos('user_id', userId, filter);
	}

	/**
	 * Retrieves the videos of the given game.
	 *
	 * @param gameId The game you want to retrieve videos from.
	 * @param filter Additional filters for the result set.
	 */
	getVideosByGame(gameId: string, filter: HelixVideoFilter = {}) {
		return this._getVideos('game_id', gameId, filter);
	}

	private _getVideos(filterType: HelixVideoFilterType, filterValues: string | string[], filter: HelixVideoFilter = {}) {
		const { language, period, orderBy, type } = filter;
		return new HelixPaginatedRequest(
			{
				url: 'videos',
				query: {
					[filterType]: filterValues,
					language,
					period,
					sort: orderBy,
					type
				}
			},
			this._client,
			(data: HelixVideoData) => new HelixVideo(data, this._client)
		);
	}
}
