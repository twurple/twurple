import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import {
	createBroadcasterQuery,
	type HelixPaginatedResponse,
	type HelixPaginatedResponseWithTotal,
	type HelixResponse,
} from '@twurple/api-call';
import { type CommercialLength, extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import {
	createChannelCommercialBody,
	createChannelFollowerQuery,
	createChannelUpdateBody,
	createChannelVipUpdateQuery,
	createFollowedChannelQuery,
	type HelixChannelData,
	type HelixChannelEditorData,
	type HelixChannelFollowerData,
	type HelixFollowedChannelData,
} from '../../interfaces/endpoints/channel.external';
import { type HelixChannelUpdate } from '../../interfaces/endpoints/channel.input';
import {
	createChannelUsersCheckQuery,
	createSingleKeyQuery,
	type HelixUserRelationData,
} from '../../interfaces/endpoints/generic.external';
import { HelixUserRelation } from '../../relations/HelixUserRelation';
import { HelixRequestBatcher } from '../../utils/HelixRequestBatcher';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import { HelixPaginatedRequestWithTotal } from '../../utils/pagination/HelixPaginatedRequestWithTotal';
import {
	createPaginatedResult,
	createPaginatedResultWithTotal,
	type HelixPaginatedResult,
	type HelixPaginatedResultWithTotal,
} from '../../utils/pagination/HelixPaginatedResult';
import { createPaginationQuery, type HelixForwardPagination } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixChannel } from './HelixChannel';
import { HelixChannelEditor } from './HelixChannelEditor';
import { HelixChannelFollower } from './HelixChannelFollower';
import { HelixFollowedChannel } from './HelixFollowedChannel';

/**
 * The Helix API methods that deal with channels.
 *
 * Can be accessed using `client.channels` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const channel = await api.channels.getChannelInfoById('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Channels
 */
@rtfm('api', 'HelixChannelApi')
export class HelixChannelApi extends BaseApi {
	/** @internal */
	@Enumerable(false) private readonly _getChannelByIdBatcher = new HelixRequestBatcher(
		{
			url: 'channels',
		},
		'broadcaster_id',
		'broadcaster_id',
		this._client,
		(data: HelixChannelData) => new HelixChannel(data, this._client),
	);

	/**
	 * Gets the channel data for the given user.
	 *
	 * @param user The user you want to get channel info for.
	 */
	async getChannelInfoById(user: UserIdResolvable): Promise<HelixChannel | null> {
		const userId = extractUserId(user);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixChannelData>>({
			type: 'helix',
			url: 'channels',
			userId,
			query: createBroadcasterQuery(userId),
		});

		return mapNullable(result.data[0], data => new HelixChannel(data, this._client));
	}

	/**
	 * Gets the channel data for the given user, batching multiple calls into fewer requests as the API allows.
	 *
	 * @param user The user you want to get channel info for.
	 */
	async getChannelInfoByIdBatched(user: UserIdResolvable): Promise<HelixChannel | null> {
		return await this._getChannelByIdBatcher.request(extractUserId(user));
	}

	/**
	 * Gets the channel data for the given users.
	 *
	 * @param users The users you want to get channel info for.
	 */
	async getChannelInfoByIds(users: UserIdResolvable[]): Promise<HelixChannel[]> {
		const userIds = users.map(extractUserId);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixChannelData>>({
			type: 'helix',
			url: 'channels',
			query: createSingleKeyQuery('broadcaster_id', userIds),
		});

		return result.data.map(data => new HelixChannel(data, this._client));
	}

	/**
	 * Updates the given user's channel data.
	 *
	 * @param user The user you want to update channel info for.
	 * @param data The channel info to set.
	 */
	async updateChannelInfo(user: UserIdResolvable, data: HelixChannelUpdate): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'channels',
			method: 'PATCH',
			userId: extractUserId(user),
			scopes: ['channel:manage:broadcast'],
			query: createBroadcasterQuery(user),
			jsonBody: createChannelUpdateBody(data),
		});
	}

	/**
	 * Starts a commercial on a channel.
	 *
	 * @param broadcaster The broadcaster on whose channel the commercial is started.
	 * @param length The length of the commercial, in seconds.
	 */
	async startChannelCommercial(broadcaster: UserIdResolvable, length: CommercialLength): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'channels/commercial',
			method: 'POST',
			userId: extractUserId(broadcaster),
			scopes: ['channel:edit:commercial'],
			jsonBody: createChannelCommercialBody(broadcaster, length),
		});
	}

	/**
	 * Gets a list of users who have editor permissions on your channel.
	 *
	 * @param broadcaster The broadcaster to retreive the editors for.
	 */
	async getChannelEditors(broadcaster: UserIdResolvable): Promise<HelixChannelEditor[]> {
		const result = await this._client.callApi<HelixResponse<HelixChannelEditorData>>({
			type: 'helix',
			url: 'channels/editors',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:editors'],
			query: createBroadcasterQuery(broadcaster),
		});

		return result.data.map(data => new HelixChannelEditor(data, this._client));
	}

	/**
	 * Gets a list of VIPs in a channel.
	 *
	 * @param broadcaster The owner of the channel to get VIPs for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getVips(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination,
	): Promise<HelixPaginatedResult<HelixUserRelation>> {
		const response = await this._client.callApi<HelixPaginatedResponse<HelixUserRelationData>>({
			type: 'helix',
			url: 'channels/vips',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:vips', 'channel:manage:vips'],
			query: {
				...createBroadcasterQuery(broadcaster),
				...createPaginationQuery(pagination),
			},
		});

		return createPaginatedResult(response, HelixUserRelation, this._client);
	}

	/**
	 * Creates a paginator for VIPs in a channel.
	 *
	 * @param broadcaster The owner of the channel to get VIPs for.
	 */
	getVipsPaginated(broadcaster: UserIdResolvable): HelixPaginatedRequest<HelixUserRelationData, HelixUserRelation> {
		return new HelixPaginatedRequest(
			{
				url: 'channels/vips',
				userId: extractUserId(broadcaster),
				scopes: ['channel:read:vips', 'channel:manage:vips'],
				query: createBroadcasterQuery(broadcaster),
			},
			this._client,
			data => new HelixUserRelation(data, this._client),
		);
	}

	/**
	 * Checks the VIP status of a list of users in a channel.
	 *
	 * @param broadcaster The owner of the channel to check VIP status in.
	 * @param users The users to check.
	 */
	async checkVipForUsers(broadcaster: UserIdResolvable, users: UserIdResolvable[]): Promise<HelixUserRelation[]> {
		const response = await this._client.callApi<HelixPaginatedResponse<HelixUserRelationData>>({
			type: 'helix',
			url: 'channels/vips',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:vips', 'channel:manage:vips'],
			query: createChannelUsersCheckQuery(broadcaster, users),
		});

		return response.data.map(data => new HelixUserRelation(data, this._client));
	}

	/**
	 * Checks the VIP status of a user in a channel.
	 *
	 * @param broadcaster The owner of the channel to check VIP status in.
	 * @param user The user to check.
	 */
	async checkVipForUser(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<boolean> {
		const userId = extractUserId(user);
		const result = await this.checkVipForUsers(broadcaster, [userId]);

		return result.some(rel => rel.id === userId);
	}

	/**
	 * Adds a VIP to the broadcaster’s chat room.
	 *
	 * @param broadcaster The broadcaster that’s granting VIP status to the user. This ID must match the user ID in the access token.
	 * @param user The user to add as a VIP in the broadcaster’s chat room.
	 */
	async addVip(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'channels/vips',
			method: 'POST',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:vips'],
			query: createChannelVipUpdateQuery(broadcaster, user),
		});
	}

	/**
	 * Removes a VIP from the broadcaster’s chat room.
	 *
	 * @param broadcaster The broadcaster that’s removing VIP status from the user. This ID must match the user ID in the access token.
	 * @param user The user to remove as a VIP from the broadcaster’s chat room.
	 */
	async removeVip(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'channels/vips',
			method: 'DELETE',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:vips'],
			query: createChannelVipUpdateQuery(broadcaster, user),
		});
	}

	/**
	 * Gets the total number of users that follow the specified broadcaster.
	 *
	 * @param broadcaster The broadcaster you want to get the number of followers of.
	 */
	async getChannelFollowerCount(broadcaster: UserIdResolvable): Promise<number> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<never>>({
			type: 'helix',
			url: 'channels/followers',
			method: 'GET',
			userId: extractUserId(broadcaster),
			query: {
				...createChannelFollowerQuery(broadcaster),
				...createPaginationQuery({ limit: 1 }),
			},
		});

		return result.total;
	}

	/**
	 * Gets a list of users that follow the specified broadcaster.
	 * You can also use this endpoint to see whether a specific user follows the broadcaster.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster you want to get a list of followers for.
	 * @param user An optional user to determine if this user follows the broadcaster.
	 * If specified, the response contains this user if they follow the broadcaster.
	 * If not specified, the response contains all users that follow the broadcaster.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getChannelFollowers(
		broadcaster: UserIdResolvable,
		user?: UserIdResolvable,
		pagination?: HelixForwardPagination,
	): Promise<HelixPaginatedResultWithTotal<HelixChannelFollower>> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixChannelFollowerData>>({
			type: 'helix',
			url: 'channels/followers',
			method: 'GET',
			userId: extractUserId(broadcaster),
			canOverrideScopedUserContext: true,
			scopes: ['moderator:read:followers'],
			query: {
				...createChannelFollowerQuery(broadcaster, user),
				...createPaginationQuery(pagination),
			},
		});

		return createPaginatedResultWithTotal(result, HelixChannelFollower, this._client);
	}

	/**
	 * Creates a paginator for users that follow the specified broadcaster.
	 *
	 * This uses the token of the broadcaster by default.
	 * If you want to execute this in the context of another user (who has to be moderator of the channel)
	 * you can do so using [user context overrides](/docs/auth/concepts/context-switching).
	 *
	 * @param broadcaster The broadcaster for whom you are getting a list of followers.
	 *
	 * @expandParams
	 */
	getChannelFollowersPaginated(
		broadcaster: UserIdResolvable,
	): HelixPaginatedRequestWithTotal<HelixChannelFollowerData, HelixChannelFollower> {
		return new HelixPaginatedRequestWithTotal<HelixChannelFollowerData, HelixChannelFollower>(
			{
				url: 'channels/followers',
				method: 'GET',
				userId: extractUserId(broadcaster),
				canOverrideScopedUserContext: true,
				scopes: ['moderator:read:followers'],
				query: createChannelFollowerQuery(broadcaster),
			},
			this._client,
			data => new HelixChannelFollower(data, this._client),
		);
	}

	/**
	 * Gets a list of broadcasters that the specified user follows.
	 * You can also use this endpoint to see whether the user follows a specific broadcaster.
	 *
	 * @param user The user that's getting a list of followed channels.
	 * This ID must match the user ID in the access token.
	 * @param broadcaster An optional broadcaster to determine if the user follows this broadcaster.
	 * If specified, the response contains this broadcaster if the user follows them.
	 * If not specified, the response contains all broadcasters that the user follows.
	 * @param pagination
	 * @returns
	 */
	async getFollowedChannels(
		user: UserIdResolvable,
		broadcaster?: UserIdResolvable,
		pagination?: HelixForwardPagination,
	): Promise<HelixPaginatedResultWithTotal<HelixFollowedChannel>> {
		const result = await this._client.callApi<HelixPaginatedResponseWithTotal<HelixFollowedChannelData>>({
			type: 'helix',
			url: 'channels/followed',
			method: 'GET',
			userId: extractUserId(user),
			scopes: ['user:read:follows'],
			query: {
				...createFollowedChannelQuery(user, broadcaster),
				...createPaginationQuery(pagination),
			},
		});

		return createPaginatedResultWithTotal(result, HelixFollowedChannel, this._client);
	}

	/**
	 * Creates a paginator for broadcasters that the specified user follows.
	 *
	 * @param user The user that's getting a list of followed channels.
	 * The token of this user will be used to get the list of followed channels.
	 * @param broadcaster An optional broadcaster to determine if the user follows this broadcaster.
	 * If specified, the response contains this broadcaster if the user follows them.
	 * If not specified, the response contains all broadcasters that the user follows.
	 * @returns
	 */
	getFollowedChannelsPaginated(
		user: UserIdResolvable,
		broadcaster?: UserIdResolvable,
	): HelixPaginatedRequestWithTotal<HelixFollowedChannelData, HelixFollowedChannel> {
		return new HelixPaginatedRequestWithTotal<HelixFollowedChannelData, HelixFollowedChannel>(
			{
				url: 'channels/followed',
				method: 'GET',
				userId: extractUserId(user),
				scopes: ['user:read:follows'],
				query: createFollowedChannelQuery(user, broadcaster),
			},
			this._client,
			data => new HelixFollowedChannel(data, this._client),
		);
	}
}
