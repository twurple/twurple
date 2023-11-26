import { Enumerable, flatten, mapNullable } from '@d-fischer/shared-utils';
import {
	createBroadcasterQuery,
	type HelixPaginatedResponse,
	type HelixResponse,
	HttpStatusCodeError,
} from '@twurple/api-call';
import { extractUserId, extractUserName, rtfm, type UserIdResolvable, type UserNameResolvable } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import { StreamNotLiveError } from '../../errors/StreamNotLiveError';
import { createSingleKeyQuery, createUserQuery } from '../../interfaces/endpoints/generic.external';
import {
	createStreamMarkerBody,
	createStreamQuery,
	createVideoQuery,
	type HelixGetStreamKeyData,
	type HelixStreamData,
	type HelixStreamGetMarkersResponse,
	type HelixStreamMarkerData,
} from '../../interfaces/endpoints/stream.external';
import { type HelixPaginatedStreamFilter, type HelixStreamFilter } from '../../interfaces/endpoints/stream.input';
import { HelixRequestBatcher } from '../../utils/HelixRequestBatcher';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import { createPaginatedResult, type HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import {
	createPaginationQuery,
	type HelixForwardPagination,
	type HelixPagination,
} from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
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
 * const api = new ApiClient({ authProvider });
 * const stream = await api.streams.getStreamByUserId('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Streams
 */
@rtfm('api', 'HelixStreamApi')
export class HelixStreamApi extends BaseApi {
	/** @internal */
	@Enumerable(false) private readonly _getStreamByUserIdBatcher = new HelixRequestBatcher(
		{
			url: 'streams',
		},
		'user_id',
		'user_id',
		this._client,
		(data: HelixStreamData) => new HelixStream(data, this._client),
	);

	/** @internal */
	@Enumerable(false) private readonly _getStreamByUserNameBatcher = new HelixRequestBatcher(
		{
			url: 'streams',
		},
		'user_login',
		'user_login',
		this._client,
		(data: HelixStreamData) => new HelixStream(data, this._client),
	);

	/**
	 * Gets a list of streams.
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
				...createPaginationQuery(filter),
			},
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
				query: createStreamQuery(filter),
			},
			this._client,
			data => new HelixStream(data, this._client),
		);
	}

	/**
	 * Gets the current streams for the given usernames.
	 *
	 * @param users The username to get the streams for.
	 */
	async getStreamsByUserNames(users: UserNameResolvable[]): Promise<HelixStream[]> {
		const result = await this.getStreams({ userName: users.map(extractUserName) });

		return result.data;
	}

	/**
	 * Gets the current stream for the given username.
	 *
	 * @param user The username to get the stream for.
	 */
	async getStreamByUserName(user: UserNameResolvable): Promise<HelixStream | null> {
		const result = await this.getStreamsByUserNames([user]);

		return result[0] ?? null;
	}

	/**
	 * Gets the current stream for the given username, batching multiple calls into fewer requests as the API allows.
	 *
	 * @param user The username to get the stream for.
	 */
	async getStreamByUserNameBatched(user: UserNameResolvable): Promise<HelixStream | null> {
		return await this._getStreamByUserNameBatcher.request(extractUserName(user));
	}

	/**
	 * Gets the current streams for the given user IDs.
	 *
	 * @param users The user IDs to get the streams for.
	 */
	async getStreamsByUserIds(users: UserIdResolvable[]): Promise<HelixStream[]> {
		const result = await this.getStreams({ userId: users.map(extractUserId) });

		return result.data;
	}

	/**
	 * Gets the current stream for the given user ID.
	 *
	 * @param user The user ID to get the stream for.
	 */
	async getStreamByUserId(user: UserIdResolvable): Promise<HelixStream | null> {
		const userId = extractUserId(user);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixStreamData>>({
			url: 'streams',
			type: 'helix',
			userId,
			query: createStreamQuery({ userId }),
		});

		return mapNullable(result.data[0], data => new HelixStream(data, this._client));
	}

	/**
	 * Gets the current stream for the given user ID, batching multiple calls into fewer requests as the API allows.
	 *
	 * @param user The user ID to get the stream for.
	 */
	async getStreamByUserIdBatched(user: UserIdResolvable): Promise<HelixStream | null> {
		return await this._getStreamByUserIdBatcher.request(extractUserId(user));
	}

	/**
	 * Gets a list of all stream markers for a user.
	 *
	 * @param user The user to list the stream markers for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getStreamMarkersForUser(
		user: UserIdResolvable,
		pagination?: HelixPagination,
	): Promise<HelixPaginatedResult<HelixStreamMarkerWithVideo>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixStreamGetMarkersResponse>>({
			url: 'streams/markers',
			type: 'helix',
			query: {
				...createUserQuery(user),
				...createPaginationQuery(pagination),
			},
			userId: extractUserId(user),
			scopes: ['user:read:broadcast'],
			canOverrideScopedUserContext: true,
		});

		return {
			data: flatten(result.data.map(data => HelixStreamApi._mapGetStreamMarkersResult(data, this._client))),
			cursor: (result.pagination as { cursor: string } | undefined)?.cursor,
		};
	}

	/**
	 * Creates a paginator for all stream markers for a user.
	 *
	 * @param user The user to list the stream markers for.
	 */
	getStreamMarkersForUserPaginated(
		user: UserIdResolvable,
	): HelixPaginatedRequest<HelixStreamGetMarkersResponse, HelixStreamMarkerWithVideo> {
		return new HelixPaginatedRequest(
			{
				url: 'streams/markers',
				query: createUserQuery(user),
				userId: extractUserId(user),
				scopes: ['user:read:broadcast'],
				canOverrideScopedUserContext: true,
			},
			this._client,
			data => HelixStreamApi._mapGetStreamMarkersResult(data, this._client),
		);
	}

	/**
	 * Gets a list of all stream markers for a video.
	 *
	 * @param user The user the video belongs to.
	 * @param videoId The video to list the stream markers for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getStreamMarkersForVideo(
		user: UserIdResolvable,
		videoId: string,
		pagination?: HelixPagination,
	): Promise<HelixPaginatedResult<HelixStreamMarkerWithVideo>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixStreamGetMarkersResponse>>({
			url: 'streams/markers',
			type: 'helix',
			query: {
				...createVideoQuery(videoId),
				...createPaginationQuery(pagination),
			},
			userId: extractUserId(user),
			scopes: ['user:read:broadcast'],
			canOverrideScopedUserContext: true,
		});

		return {
			data: flatten(result.data.map(data => HelixStreamApi._mapGetStreamMarkersResult(data, this._client))),
			cursor: (result.pagination as { cursor: string } | undefined)?.cursor,
		};
	}

	/**
	 * Creates a paginator for all stream markers for a video.
	 *
	 * @param user The user the video belongs to.
	 * @param videoId The video to list the stream markers for.
	 */
	getStreamMarkersForVideoPaginated(
		user: UserIdResolvable,
		videoId: string,
	): HelixPaginatedRequest<HelixStreamGetMarkersResponse, HelixStreamMarkerWithVideo> {
		return new HelixPaginatedRequest(
			{
				url: 'streams/markers',
				query: createVideoQuery(videoId),
				userId: extractUserId(user),
				scopes: ['user:read:broadcast'],
				canOverrideScopedUserContext: true,
			},
			this._client,
			data => HelixStreamApi._mapGetStreamMarkersResult(data, this._client),
		);
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
				userId: extractUserId(broadcaster),
				scopes: ['channel:manage:broadcast'],
				canOverrideScopedUserContext: true,
				jsonBody: createStreamMarkerBody(broadcaster, description),
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
	 * Gets the stream key of a stream.
	 *
	 * @param broadcaster The broadcaster to get the stream key for.
	 */
	async getStreamKey(broadcaster: UserIdResolvable): Promise<string> {
		const userId = extractUserId(broadcaster);
		const result = await this._client.callApi<HelixResponse<HelixGetStreamKeyData>>({
			type: 'helix',
			url: 'streams/key',
			userId,
			scopes: ['channel:read:stream_key'],
			query: createBroadcasterQuery(broadcaster),
		});

		return result.data[0].stream_key;
	}

	/**
	 * Gets the streams that are currently live and are followed by the given user.
	 *
	 * @param user The user to check followed streams for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getFollowedStreams(
		user: UserIdResolvable,
		pagination?: HelixForwardPagination,
	): Promise<HelixPaginatedResult<HelixStream>> {
		const userId = extractUserId(user);
		const result = await this._client.callApi<HelixPaginatedResult<HelixStreamData>>({
			type: 'helix',
			url: 'streams/followed',
			userId,
			scopes: ['user:read:follows'],
			query: {
				...createSingleKeyQuery('user_id', userId),
				...createPaginationQuery(pagination),
			},
		});

		return createPaginatedResult(result, HelixStream, this._client);
	}

	/**
	 * Creates a paginator for the streams that are currently live and are followed by the given user.
	 *
	 * @param user The user to check followed streams for.
	 */
	getFollowedStreamsPaginated(user: UserIdResolvable): HelixPaginatedRequest<HelixStreamData, HelixStream> {
		const userId = extractUserId(user);
		return new HelixPaginatedRequest(
			{
				url: 'streams/followed',
				userId,
				scopes: ['user:read:follows'],
				query: createSingleKeyQuery('user_id', userId),
			},
			this._client,
			data => new HelixStream(data, this._client),
		);
	}

	private static _mapGetStreamMarkersResult(data: HelixStreamGetMarkersResponse, client: BaseApiClient) {
		return data.videos.reduce<HelixStreamMarkerWithVideo[]>(
			(result, video) => [
				...result,
				...video.markers.map(marker => new HelixStreamMarkerWithVideo(marker, video.video_id, client)),
			],
			[],
		);
	}
}
