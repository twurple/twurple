import BaseAPI from '../../BaseAPI';
import { TwitchAPICallType } from '../../../TwitchClient';
import HelixPagination from '../HelixPagination';
import HelixClip, { HelixClipData } from './HelixClip';
import HelixPaginatedRequest from '../HelixPaginatedRequest';

export type HelixClipFilterType = 'broadcaster_id' | 'game_id' | 'id';

/** @private */
export interface HelixClipFilter extends HelixPagination {
	filterType: HelixClipFilterType;
	ids: string | string[];
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
 * const clipId = await client.helix.clips.createClip({ channelId: '125328655' });
 * ```
 */
export default class HelixClipAPI extends BaseAPI {
	/**
	 * Retrieves the latest clips for the specified broadcaster.
	 *
	 * @param id The broadcaster's user ID.
	 * @param pagination Parameters for pagination.
	 */
	getClipsForBroadcaster(id: string, pagination: HelixPagination) {
		return this._getClips({
			...pagination,
			filterType: 'broadcaster_id',
			ids: id
		});
	}

	/**
	 * Retrieves the latest clips for the specified game.
	 *
	 * @param id The game ID.
	 * @param pagination Parameters for pagination.
	 */
	getClipsForGame(id: string, pagination: HelixPagination) {
		return this._getClips({
			...pagination,
			filterType: 'game_id',
			ids: id
		});
	}

	/**
	 * Retrieves the clips identified by the given IDs.
	 *
	 * @param ids The clip IDs.
	 */
	getClipsByIds(ids: string[]) {
		return this._getClips({
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
		const req = this.getClipsByIds([id]);
		const clips = await req.getAll();
		return clips.length ? clips[0] : null;
	}

	private _getClips(params: HelixClipFilter) {
		const { filterType, ids, after, before, limit } = params;

		return new HelixPaginatedRequest(
			{
				type: TwitchAPICallType.Helix,
				url: 'clips',
				method: 'GET',
				query: {
					[filterType]: ids,
					after,
					before,
					first: limit
				}
			},
			this._client,
			(data: HelixClipData) => new HelixClip(data, this._client)
		);
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
}
