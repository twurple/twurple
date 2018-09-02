import BaseAPI from '../../BaseAPI';
import { TwitchAPICallType } from '../../../TwitchClient';
import { HelixPaginatedResponse } from '../HelixResponse';
import HelixVideo, { HelixVideoData, HelixVideoType } from './HelixVideo';
import HelixPagination from '../HelixPagination';
import HelixPaginatedResult from '../HelixPaginatedResult';
import UserTools, { UserIdResolvable } from '../../../Toolkit/UserTools';

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
 * const client = new TwitchClient(options);
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
		if (!videos.length) {
			throw new Error('video not found');
		}
		return videos[0];
	}

	/**
	 * Retrieves the videos of the given user.
	 *
	 * @param user The user you want to retrieve videos from.
	 */
	async getVideosByUser(user: UserIdResolvable) {
		const userId = UserTools.getUserId(user);
		return this._getVideos('user_id', userId);
	}

	/**
	 * Retrieves the videos of the given game.
	 *
	 * @param gameId The game you want to retrieve videos from.
	 */
	async getVideosByGame(gameId: string) {
		return this._getVideos('game_id', gameId);
	}

	private async _getVideos(filterType: HelixVideoFilterType, filterValues: string | string[], filter: HelixVideoFilter = {}): Promise<HelixPaginatedResult<HelixVideo>> {
		const { language, period, orderBy, type } = filter;
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixVideoData>>({
			type: TwitchAPICallType.Helix,
			url: 'videos',
			query: {
				[filterType]: filterValues,
				language,
				period,
				sort: orderBy,
				type
			}
		});

		return {
			data: result.data.map(data => new HelixVideo(data, this._client)),
			cursor: result.pagination.cursor
		};
	}
}
