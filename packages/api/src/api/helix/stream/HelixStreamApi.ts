import { flatten } from '@d-fischer/shared-utils';
import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { HttpStatusCodeError } from '@twurple/api-call';
import type { UserIdResolvable, UserNameResolvable } from '@twurple/common';
import { extractUserId, extractUserName, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { StreamNotLiveError } from '../../../errors/StreamNotLiveError';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination, HelixPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixTagData } from '../tag/HelixTag';
import { HelixTag } from '../tag/HelixTag';
import type { HelixStreamData, HelixStreamType } from './HelixStream';
import { HelixStream } from './HelixStream';
import type { HelixStreamMarkerData } from './HelixStreamMarker';
import { HelixStreamMarker } from './HelixStreamMarker';
import type { HelixStreamMarkerVideoData } from './HelixStreamMarkerWithVideo';
import { HelixStreamMarkerWithVideo } from './HelixStreamMarkerWithVideo';

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
	user_login: string;
	user_name: string;
	videos: HelixStreamGetMarkersResultVideo[];
}

/**
 * The Helix API methods that deal with streams.
 *
 * Can be accessed using `client.streams` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const stream = await api.streams.getStreamByUserId('125328655');
 * ```
 */
@rtfm('api', 'HelixStreamApi')
export class HelixStreamApi extends BaseApi {
	/**
	 * Retrieves a list of streams.
	 *
	 * @expandParams
	 */
	async getStreams(filter: HelixPaginatedStreamFilter = {}): Promise<HelixPaginatedResult<HelixStream>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixStreamData>>({
			url: 'streams',
			type: 'helix',
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
	getStreamsPaginated(filter: HelixStreamFilter = {}): HelixPaginatedRequest<HelixStreamData, HelixStream> {
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
			data => new HelixStream(data, this._client)
		);
	}

	/**
	 * Retrieves the current stream for the given user name.
	 *
	 * @param user The user name to retrieve the stream for.
	 */
	async getStreamByUserName(user: UserNameResolvable): Promise<HelixStream | null> {
		const result = await this.getStreams({ userName: extractUserName(user) });

		return result.data.length ? result.data[0] : null;
	}

	/**
	 * Retrieves the current stream for the given user ID.
	 *
	 * @param user The user ID to retrieve the stream for.
	 */
	async getStreamByUserId(user: UserIdResolvable): Promise<HelixStream | null> {
		const result = await this.getStreams({ userId: extractUserId(user) });

		return result.data.length ? result.data[0] : null;
	}

	/**
	 * Retrieves a list of all stream markers for an user.
	 *
	 * @param user The user to list the stream markers for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getStreamMarkersForUser(
		user: UserIdResolvable,
		pagination?: HelixPagination
	): Promise<HelixPaginatedResult<HelixStreamMarker>> {
		return await this._getStreamMarkers('user_id', extractUserId(user), pagination);
	}

	/**
	 * Creates a paginator for all stream markers for an user.
	 *
	 * @param user The user to list the stream markers for.
	 */
	getStreamMarkersForUserPaginated(
		user: UserIdResolvable
	): HelixPaginatedRequest<HelixStreamGetMarkersResult, HelixStreamMarkerWithVideo> {
		return this._getStreamMarkersPaginated('user_id', extractUserId(user));
	}

	/**
	 * Retrieves a list of all stream markers for a video.
	 *
	 * @param videoId The video to list the stream markers for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getStreamMarkersForVideo(
		videoId: string,
		pagination?: HelixPagination
	): Promise<HelixPaginatedResult<HelixStreamMarkerWithVideo>> {
		return await this._getStreamMarkers('video_id', videoId, pagination);
	}

	/**
	 * Creates a paginator for all stream markers for a video.
	 *
	 * @param videoId The video to list the stream markers for.
	 */
	getStreamMarkersForVideoPaginated(
		videoId: string
	): HelixPaginatedRequest<HelixStreamGetMarkersResult, HelixStreamMarkerWithVideo> {
		return this._getStreamMarkersPaginated('video_id', videoId);
	}

	/**
	 * Creates a new stream marker.
	 *
	 * Only works while the specified user's stream is live.
	 *
	 * @param broadcaster The broadcaster to create a stream marker for.
	 * @param description The description of the marker.
	 */
	async createStreamMarker(broadcaster: UserIdResolvable, description?: string): Promise<HelixStreamMarker> {
		try {
			const result = await this._client.callApi<HelixResponse<HelixStreamMarkerData>>({
				url: 'streams/markers',
				method: 'POST',
				type: 'helix',
				scope: 'channel:manage:broadcast',
				query: {
					user_id: extractUserId(broadcaster),
					description
				}
			});

			return new HelixStreamMarker(result.data[0], this._client);
		} catch (e) {
			if (e instanceof HttpStatusCodeError && e.statusCode === 404) {
				throw new StreamNotLiveError();
			}

			throw e;
		}
	}

	/**
	 * Retrieves the tags of a stream.
	 *
	 * @param broadcaster The broadcaster of the stream.
	 */
	async getStreamTags(broadcaster: UserIdResolvable): Promise<HelixTag[]> {
		const result = await this._client.callApi<HelixResponse<HelixTagData>>({
			type: 'helix',
			url: 'streams/tags',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return result.data.map(data => new HelixTag(data));
	}

	/**
	 * Replaces the tags of a stream.
	 *
	 * @param broadcaster The broadcaster of the stream.
	 * @param tagIds The tags to set. If not given, removes all tags.
	 */
	async replaceStreamTags(broadcaster: UserIdResolvable, tagIds?: string[]): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'streams/tags',
			scope: 'channel:manage:broadcast',
			method: 'PUT',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			},
			jsonBody: {
				tag_ids: tagIds
			}
		});
	}

	/**
	 * Retrieves the stream key of a stream.
	 *
	 * @param broadcaster The broadcaster to retrieve the stream key for.
	 */
	async getStreamKey(broadcaster: UserIdResolvable): Promise<string> {
		const result = await this._client.callApi<HelixResponse<{ stream_key: string }>>({
			type: 'helix',
			url: 'streams/key',
			scope: 'channel:read:stream_key',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return result.data[0].stream_key;
	}

	/**
	 * Retrieves the streams that are currently live and are followed by the given user.
	 *
	 * @param user The user to check followed streams for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getFollowedStreams(
		user: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixStream>> {
		const result = await this._client.callApi<HelixPaginatedResult<HelixStreamData>>({
			type: 'helix',
			url: 'streams/followed',
			scope: 'user:read:follows',
			query: {
				user_id: extractUserId(user),
				...makePaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixStream, this._client);
	}

	/**
	 * Creates a paginator for the streams that are currently live and are followed by the given user.
	 *
	 * @param user The user to check followed streams for.
	 */
	getFollowedStreamsPaginated(user: UserIdResolvable): HelixPaginatedRequest<HelixStreamData, HelixStream> {
		return new HelixPaginatedRequest(
			{
				url: 'streams/followed',
				scope: 'user:read:follows',
				query: {
					user_id: extractUserId(user)
				}
			},
			this._client,
			data => new HelixStream(data, this._client)
		);
	}

	private async _getStreamMarkers(
		queryType: string,
		id: string,
		pagination?: HelixPagination
	): Promise<HelixPaginatedResult<HelixStreamMarkerWithVideo>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixStreamGetMarkersResult>>({
			url: 'streams/markers',
			type: 'helix',
			query: {
				[queryType]: id,
				...makePaginationQuery(pagination)
			},
			scope: 'user:read:broadcast'
		});

		return {
			data: flatten(result.data.map(HelixStreamApi._mapGetStreamMarkersResult.bind(this._client))),
			cursor: result.pagination?.cursor
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
			HelixStreamApi._mapGetStreamMarkersResult.bind(this._client)
		);
	}

	private static _mapGetStreamMarkersResult(this: ApiClient, data: HelixStreamGetMarkersResult) {
		return data.videos.reduce<HelixStreamMarkerWithVideo[]>(
			(result, video) => [
				...result,
				...video.markers.map(marker => new HelixStreamMarkerWithVideo(marker, video.video_id, this))
			],
			[]
		);
	}
}
