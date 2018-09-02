import BaseAPI from '../../BaseAPI';
import { TwitchApiCallType } from '../../../TwitchClient';
import HelixResponse from '../HelixResponse';
import HelixPagination from '../HelixPagination';
import HelixPaginatedResult from '../HelixPaginatedResult';
import HelixClip, { HelixClipData } from './HelixClip';

export type HelixClipFilterType = 'broadcaster_id' | 'game_id' | 'id';

/** @private */
export interface HelixClipFilter extends HelixPagination {
	filterType: HelixClipFilterType;
	ids: string[];
}

/**
 * Parameters for creating a clip.
 */
export interface HelixClipCreateParams {
	/**
	 * The ID of the channel of which you want to create a clip.
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
 * Can be accessed using `client.helix.clips` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = new TwitchClient(options);
 * const leaderboard = await client.helix.clips.createClip({ channelId: '125328655' });
 * ```
 */
export default class HelixClipAPI extends BaseAPI {
	/**
	 * Retrieves the latest clips for the specified broadcaster.
	 *
	 * @param id The broadcaster's user ID.
	 * @param pagination Parameters for pagination.
	 */
	async getClipsForBroadcaster(id: string, pagination: HelixPagination) {
		return this.getClips({
			...pagination,
			filterType: 'broadcaster_id',
			ids: [id]
		});
	}

	/**
	 * Retrieves the latest clips for the specified game.
	 *
	 * @param id The game ID.
	 * @param pagination Parameters for pagination.
	 */
	async getClipsForGame(id: string, pagination: HelixPagination) {
		return this.getClips({
			...pagination,
			filterType: 'game_id',
			ids: [id]
		});
	}

	/**
	 * Retrieves the clips identified by the given IDs.
	 *
	 * @param ids The clip IDs.
	 */
	async getClipsByIds(ids: string[]) {
		return this.getClips({
			filterType: 'id',
			ids
		});
	}

	/**
	 * Retrieves the clip identified by the given ID.
	 *
	 * @param id The clip ID.
	 */
	async getClipById(id: string) {
		const { data } = await this.getClipsByIds([id]);
		if (!data.length) {
			throw new Error('clip not found');
		}
		return data[0];
	}

	private async getClips(params: HelixClipFilter): Promise<HelixPaginatedResult<HelixClip[]>> {
		const { filterType, ids, after, before, limit } = params;
		const result = await this._client.apiCall<HelixResponse<HelixClipData[]>>({
			type: TwitchApiCallType.Helix,
			url: 'clips',
			method: 'GET',
			query: {
				[filterType]: ids,
				after,
				before,
				first: limit
			}
		});

		return {
			data: result.data.map(data => new HelixClip(data, this._client)),
			cursor: result.pagination.cursor
		};
	}

	/**
	 * Creates a clip of a running stream.
	 *
	 * Returns the ID of the clip.
	 *
	 * @expandParams
	 */
	async createClip(params: HelixClipCreateParams) {
		const { channelId, createAfterDelay = false } = params;
		const result = await this._client.apiCall<{ data: [HelixClipCreateResponse] }>({
			type: TwitchApiCallType.Helix,
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
}
