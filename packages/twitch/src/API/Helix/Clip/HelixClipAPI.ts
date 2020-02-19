import { TwitchAPICallType } from '../../../TwitchClient';
import BaseAPI from '../../BaseAPI';
import HelixPaginatedRequest from '../HelixPaginatedRequest';
import { createPaginatedResult } from '../HelixPaginatedResult';
import { HelixPaginatedResponse } from '../HelixResponse';
import HelixClip, { HelixClipData } from './HelixClip';

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
	/**
	 * The maximum number of results to retrieve. Defaults to 20.
	 */
	limit?: number;
}

/** @private */
export interface HelixClipIdFilter extends HelixClipFilter {
	filterType: HelixClipFilterType;
	ids: string | string[];
}

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
 * Can be accessed using `client.helix.clips` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const clipId = await client.helix.clips.createClip({ channelId: '125328655' });
 * ```
 */
export default class HelixClipAPI extends BaseAPI {
	/**
	 * Retrieves the latest clips for the specified broadcaster.
	 *
	 * @param userId The broadcaster's user ID.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getClipsForBroadcaster(userId: string, filter: HelixClipFilter = {}) {
		return this._getClips({
			...filter,
			filterType: 'broadcaster_id',
			ids: userId
		});
	}

	/**
	 * Creates a paginator for the latest clips for the specified broadcaster.
	 *
	 * @param userId The broadcaster's user ID.
	 * @param filter
	 *
	 * @expandParams
	 */
	getClipsForBroadcasterPaginated(userId: string, filter: HelixClipFilter = {}) {
		return this._getClipsPaginated({
			...filter,
			filterType: 'broadcaster_id',
			ids: userId
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
	async getClipsForGame(gameId: string, filter: HelixClipFilter = {}) {
		return this._getClips({
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
	getClipsForGamePaginated(gameId: string, filter: HelixClipFilter = {}) {
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
	async getClipsByIds(ids: string[]) {
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
	async getClipById(id: string) {
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
	async createClip(params: HelixClipCreateParams) {
		const { channelId, createAfterDelay = false } = params;
		const result = await this._client.callAPI<{ data: [HelixClipCreateResponse] }>({
			type: TwitchAPICallType.Helix,
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

	private async _getClips(params: HelixClipIdFilter) {
		const { filterType, ids, startDate, endDate, limit = 20 } = params;

		const result = await this._client.callAPI<HelixPaginatedResponse<HelixClipData>>({
			type: TwitchAPICallType.Helix,
			url: 'clips',
			query: {
				[filterType]: ids,
				started_at: startDate,
				ended_at: endDate,
				first: limit.toString()
			}
		});

		return createPaginatedResult(result, HelixClip, this._client);
	}

	private _getClipsPaginated(params: HelixClipIdFilter) {
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
			(data: HelixClipData) => new HelixClip(data, this._client)
		);
	}
}
