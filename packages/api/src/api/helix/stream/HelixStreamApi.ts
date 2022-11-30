import { flatten } from '@d-fischer/shared-utils';
import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { HttpStatusCodeError } from '@twurple/api-call';
import type { UserIdResolvable, UserNameResolvable } from '@twurple/common';
import { extractUserId, extractUserName, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { StreamNotLiveError } from '../../../errors/StreamNotLiveError';
import { createSingleKeyQuery } from '../../../interfaces/helix/generic.external';
import {
	createStreamMarkerBody,
	createStreamQuery,
	type HelixGetStreamKeyData,
	type HelixStreamData,
	type HelixStreamGetMarkersResponse,
	type HelixStreamMarkerData
} from '../../../interfaces/helix/stream.external';
import { type HelixPaginatedStreamFilter, type HelixStreamFilter } from '../../../interfaces/helix/stream.input';
import { type HelixTagData } from '../../../interfaces/helix/tag.external';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination, HelixPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixTag } from '../tag/HelixTag';
import { HelixStream } from './HelixStream';
import { HelixStreamMarker } from './HelixStreamMarker';
import { HelixStreamMarkerWithVideo } from './HelixStreamMarkerWithVideo';

/**
 * The Helix API methods that deal with streams.
 *
 * Can be accessed using `client.streams` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const stream = await api.streams.getStreamByUserId('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Streams
 */
@rtfm('api', 'HelixStreamApi')
export class HelixStreamApi extends BaseApi {
	/**
	 * Retrieves a list of streams.
	 *
	 * @param filter
	 * @expandParams
	 */
	async getStreams(filter: HelixPaginatedStreamFilter = {}): Promise<HelixPaginatedResult<HelixStream>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixStreamData>>({
			url: 'streams',
			type: 'helix',
			query: {
				...createStreamQuery(filter),
				...createPaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixStream, this._client);
	}

	/**
	 * Creates a paginator for streams.
	 *
	 * @param filter
	 * @expandParams
	 */
	getStreamsPaginated(filter: HelixStreamFilter = {}): HelixPaginatedRequest<HelixStreamData, HelixStream> {
		return new HelixPaginatedRequest(
			{
				url: 'streams',
				query: createStreamQuery(filter)
			},
			this._client,
			data => new HelixStream(data, this._client)
		);
	}

	/**
	 * Retrieves the current streams for the given usernames.
	 *
	 * @param users The username to retrieve the streams for.
	 */
	async getStreamsByUserNames(users: UserNameResolvable[]): Promise<HelixStream[]> {
		const result = await this.getStreams({ userName: users.map(extractUserName) });

		return result.data;
	}

	/**
	 * Retrieves the current stream for the given username.
	 *
	 * @param user The username to retrieve the stream for.
	 */
	async getStreamByUserName(user: UserNameResolvable): Promise<HelixStream | null> {
		const result = await this.getStreamsByUserNames([user]);

		return result[0] ?? null;
	}

	/**
	 * Retrieves the current streams for the given user IDs.
	 *
	 * @param users The user IDs to retrieve the streams for.
	 */
	async getStreamsByUserIds(users: UserIdResolvable[]): Promise<HelixStream[]> {
		const result = await this.getStreams({ userId: users.map(extractUserId) });

		return result.data;
	}

	/**
	 * Retrieves the current stream for the given user ID.
	 *
	 * @param user The user ID to retrieve the stream for.
	 */
	async getStreamByUserId(user: UserIdResolvable): Promise<HelixStream | null> {
		const result = await this.getStreamsByUserIds([user]);

		return result[0] ?? null;
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
	): Promise<HelixPaginatedResult<HelixStreamMarkerWithVideo>> {
		return await this._getStreamMarkers('user_id', extractUserId(user), pagination);
	}

	/**
	 * Creates a paginator for all stream markers for an user.
	 *
	 * @param user The user to list the stream markers for.
	 */
	getStreamMarkersForUserPaginated(
		user: UserIdResolvable
	): HelixPaginatedRequest<HelixStreamGetMarkersResponse, HelixStreamMarkerWithVideo> {
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
	): HelixPaginatedRequest<HelixStreamGetMarkersResponse, HelixStreamMarkerWithVideo> {
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
				jsonBody: createStreamMarkerBody(broadcaster, description)
			});

			return new HelixStreamMarker(result.data[0], this._client);
		} catch (e) {
			if (e instanceof HttpStatusCodeError && e.statusCode === 404) {
				throw new StreamNotLiveError({ cause: e });
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
			query: createSingleKeyQuery('broadcaster_id', extractUserId(broadcaster))
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
			query: createSingleKeyQuery('broadcaster_id', extractUserId(broadcaster)),
			jsonBody: createSingleKeyQuery('tag_ids', tagIds)
		});
	}

	/**
	 * Retrieves the stream key of a stream.
	 *
	 * @param broadcaster The broadcaster to retrieve the stream key for.
	 */
	async getStreamKey(broadcaster: UserIdResolvable): Promise<string> {
		const result = await this._client.callApi<HelixResponse<HelixGetStreamKeyData>>({
			type: 'helix',
			url: 'streams/key',
			scope: 'channel:read:stream_key',
			query: createSingleKeyQuery('broadcaster_id', extractUserId(broadcaster))
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
				...createSingleKeyQuery('user_id', extractUserId(user)),
				...createPaginationQuery(pagination)
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
				query: createSingleKeyQuery('user_id', extractUserId(user))
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
		const result = await this._client.callApi<HelixPaginatedResponse<HelixStreamGetMarkersResponse>>({
			url: 'streams/markers',
			type: 'helix',
			query: {
				[queryType]: id,
				...createPaginationQuery(pagination)
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

	private static _mapGetStreamMarkersResult(this: ApiClient, data: HelixStreamGetMarkersResponse) {
		return data.videos.reduce<HelixStreamMarkerWithVideo[]>(
			(result, video) => [
				...result,
				...video.markers.map(marker => new HelixStreamMarkerWithVideo(marker, video.video_id, this))
			],
			[]
		);
	}
}
