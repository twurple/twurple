import { flatten } from '@d-fischer/shared-utils';
import { HTTPStatusCodeError } from '../../../Errors/HTTPStatusCodeError';
import { StreamNotLiveError } from '../../../Errors/StreamNotLiveError';
import { extractUserId, extractUserName, UserIdResolvable, UserNameResolvable } from '../../../Toolkit/UserTools';
import { TwitchAPICallType, TwitchClient } from '../../../TwitchClient';
import { BaseAPI } from '../../BaseAPI';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import { createPaginatedResult, HelixPaginatedResult } from '../HelixPaginatedResult';
import { HelixPagination, makePaginationQuery } from '../HelixPagination';
import { HelixPaginatedResponse, HelixResponse } from '../HelixResponse';
import { HelixStream, HelixStreamData, HelixStreamType } from './HelixStream';
import { HelixStreamMarker, HelixStreamMarkerData } from './HelixStreamMarker';
import { HelixStreamMarkerVideoData, HelixStreamMarkerWithVideo } from './HelixStreamMarkerWithVideo';

/**
 * Filters for the streams request.
 */
export interface HelixStreamFilter {
	/**
	 * A community ID or a list thereof.
	 */
	community?: string | string[];

	/**
	 * A game ID or a list thereof.
	 */
	game?: string | string[];

	/**
	 * A language or a list thereof.
	 */
	language?: string | string[];

	/**
	 * A type of stream.
	 */
	type?: HelixStreamType;

	/**
	 * A user ID or a list thereof.
	 */
	userId?: string | string[];

	/**
	 * A user name or a list thereof.
	 */
	userName?: string | string[];
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedStreamFilter extends HelixStreamFilter, HelixPagination {}

/** @private */
interface HelixStreamGetMarkersResultVideo {
	video_id: string;
	markers: HelixStreamMarkerVideoData[];
}

/** @private */
interface HelixStreamGetMarkersResult {
	user_id: string;
	user_name: string;
	videos: HelixStreamGetMarkersResultVideo[];
}

/**
 * The Helix API methods that deal with streams.
 *
 * Can be accessed using `client.helix.streams` on a {@TwitchClient} instance.
 *
 * ## Example
 * ```ts
 * const client = TwitchClient.withCredentials(clientId, accessToken);
 * const stream = await client.helix.streams.getStreamByUserId('125328655');
 * ```
 */
export class HelixStreamAPI extends BaseAPI {
	/**
	 * Retrieves a list of streams.
	 *
	 * @expandParams
	 */
	async getStreams(filter: HelixPaginatedStreamFilter = {}) {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixStreamData>>({
			url: 'streams',
			type: TwitchAPICallType.Helix,
			query: {
				...makePaginationQuery(filter),
				community_id: filter.community,
				game_id: filter.game,
				language: filter.language,
				type: filter.type,
				user_id: filter.userId,
				user_login: filter.userName
			}
		});

		return createPaginatedResult(result, HelixStream, this._client);
	}

	/**
	 * Creates a paginator for streams.
	 *
	 * @expandParams
	 */
	getStreamsPaginated(filter: HelixStreamFilter = {}) {
		return new HelixPaginatedRequest(
			{
				url: 'streams',
				query: {
					community_id: filter.community,
					game_id: filter.game,
					language: filter.language,
					type: filter.type,
					user_id: filter.userId,
					user_login: filter.userName
				}
			},
			this._client,
			(data: HelixStreamData) => new HelixStream(data, this._client)
		);
	}

	/**
	 * Retrieves the current stream for the given user name.
	 *
	 * @param user The user name to retrieve the stream for.
	 */
	async getStreamByUserName(user: UserNameResolvable) {
		const result = await this.getStreams({ userName: extractUserName(user) });

		return result.data.length ? result.data[0] : null;
	}

	/**
	 * Retrieves the current stream for the given user ID.
	 *
	 * @param user The user ID to retrieve the stream for.
	 */
	async getStreamByUserId(user: UserIdResolvable) {
		const result = await this.getStreams({ userId: extractUserId(user) });

		return result.data.length ? result.data[0] : null;
	}

	/**
	 * Retrieves a list of all stream markers for an user.
	 *
	 * @param user The user to list the stream markers for.
	 */
	async getStreamMarkersForUser(user: UserIdResolvable) {
		return this._getStreamMarkers('user_id', extractUserId(user));
	}

	/**
	 * Creates a paginator for all stream markers for an user.
	 *
	 * @param user The user to list the stream markers for.
	 */
	getStreamMarkersForUserPaginated(user: UserIdResolvable) {
		return this._getStreamMarkersPaginated('user_id', extractUserId(user));
	}

	/**
	 * Retrieves a list of all stream markers for a video.
	 *
	 * @param videoId The video to list the stream markers for.
	 */
	async getStreamMarkersForVideo(videoId: string) {
		return this._getStreamMarkers('video_id', videoId);
	}

	/**
	 * Creates a paginator for all stream markers for a video.
	 *
	 * @param videoId The video to list the stream markers for.
	 */
	getStreamMarkersForVideoPaginated(videoId: string) {
		return this._getStreamMarkersPaginated('video_id', videoId);
	}

	/**
	 * Creates a new stream marker.
	 *
	 * Only works while the specified user's stream is live.
	 */
	async createStreamMarker(userId: string, description?: string) {
		try {
			const result = await this._client.callAPI<HelixResponse<HelixStreamMarkerData>>({
				url: 'streams/markers',
				method: 'POST',
				type: TwitchAPICallType.Helix,
				scope: 'user:edit:broadcast',
				query: {
					user_id: userId,
					description
				}
			});

			return new HelixStreamMarker(result.data[0], this._client);
		} catch (e) {
			if (e instanceof HTTPStatusCodeError && e.statusCode === 404) {
				throw new StreamNotLiveError();
			}

			throw e;
		}
	}

	private async _getStreamMarkers(
		queryType: string,
		id: string
	): Promise<HelixPaginatedResult<HelixStreamMarkerWithVideo>> {
		const result = await this._client.callAPI<HelixPaginatedResponse<HelixStreamGetMarkersResult>>({
			url: 'streams/markers',
			type: TwitchAPICallType.Helix,
			query: {
				[queryType]: id
			},
			scope: 'user:read:broadcast'
		});

		return {
			data: flatten(result.data.map(HelixStreamAPI._mapGetStreamMarkersResult.bind(this._client))),
			cursor: result.pagination && result.pagination.cursor
		};
	}

	private _getStreamMarkersPaginated(queryType: string, id: string) {
		return new HelixPaginatedRequest(
			{
				url: 'streams/markers',
				query: {
					[queryType]: id
				},
				scope: 'user:read:broadcast'
			},
			this._client,
			HelixStreamAPI._mapGetStreamMarkersResult.bind(this._client)
		);
	}

	private static _mapGetStreamMarkersResult(this: TwitchClient, data: HelixStreamGetMarkersResult) {
		return data.videos.reduce<HelixStreamMarkerWithVideo[]>(
			(result, video) => [
				...result,
				...video.markers.map(marker => new HelixStreamMarkerWithVideo(marker, video.video_id, this))
			],
			[]
		);
	}
}
