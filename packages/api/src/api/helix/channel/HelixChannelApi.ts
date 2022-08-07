import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import type { CommercialLength, UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixUserRelationData } from '../relations/HelixUserRelation';
import { HelixUserRelation } from '../relations/HelixUserRelation';
import type { HelixChannelData } from './HelixChannel';
import { HelixChannel } from './HelixChannel';
import type { HelixChannelEditorData } from './HelixChannelEditor';
import { HelixChannelEditor } from './HelixChannelEditor';

/**
 * Channel data to update using {@HelixChannelApi#updateChannel}.
 */
export interface HelixChannelUpdate {
	/**
	 * The language of the stream.
	 */
	language?: string;

	/**
	 * The ID of the game you're playing.
	 */
	gameId?: string;

	/**
	 * The title of the stream.
	 */
	title?: string;

	/**
	 * The delay of the stream, in seconds.
	 *
	 * Only works if you're a Twitch partner.
	 */
	delay?: number;
}

/**
 * The Helix API methods that deal with channels.
 *
 * Can be accessed using `client.channels` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const channel = await api.channels.getChannelInfoById('125328655');
 * ```
 */
@rtfm('api', 'HelixChannelApi')
export class HelixChannelApi extends BaseApi {
	/**
	 * Retrieves the channel data for the given user.
	 *
	 * @param user The user you want to get channel info for.
	 */
	async getChannelInfoById(user: UserIdResolvable): Promise<HelixChannel | null> {
		const channels = await this.getChannelInfoByIds([user]);
		return channels[0] ?? null;
	}

	/**
	 * Retrieves the channel data for the given users.
	 *
	 * @param users The users you want to get channel info for.
	 */
	async getChannelInfoByIds(users: UserIdResolvable[]): Promise<HelixChannel[]> {
		const userIds = users.map(extractUserId);
		const result = await this._client.callApi<HelixPaginatedResponse<HelixChannelData>>({
			type: 'helix',
			url: 'channels',
			query: {
				broadcaster_id: userIds
			}
		});

		return result.data.map(data => new HelixChannel(data, this._client));
	}

	/**
	 * Retrieves the channel data for the given user.
	 *
	 * @param user The user you want to get channel info for.
	 *
	 * @deprecated Use `getChannelInfoById` instead.
	 */
	async getChannelInfo(user: UserIdResolvable): Promise<HelixChannel | null> {
		return await this.getChannelInfoById(user);
	}

	/**
	 * Updates the given user's channel data.
	 *
	 * @param user The user you want to update channel info for.
	 * @param data The channel info to set.
	 */
	async updateChannelInfo(user: UserIdResolvable, data: HelixChannelUpdate): Promise<void> {
		const userId = extractUserId(user);
		await this._client.callApi({
			type: 'helix',
			url: 'channels',
			method: 'PATCH',
			scope: 'channel:manage:broadcast',
			query: {
				broadcaster_id: userId
			},
			jsonBody: {
				game_id: data.gameId,
				broadcaster_language: data.language,
				title: data.title,
				delay: data.delay?.toString()
			}
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
			scope: 'channel:edit:commercial',
			jsonBody: {
				broadcaster_id: extractUserId(broadcaster),
				length: length
			}
		});
	}

	/**
	 * Retrieves a list of users who have editor permissions on your channel.
	 *
	 * @param broadcaster The broadcaster to retreive the editors for.
	 */
	async getChannelEditors(broadcaster: UserIdResolvable): Promise<HelixChannelEditor[]> {
		const result = await this._client.callApi<HelixResponse<HelixChannelEditorData>>({
			type: 'helix',
			url: 'channels/editors',
			scope: 'channel:read:editors',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});

		return result.data.map(data => new HelixChannelEditor(data, this._client));
	}

	/**
	 * Retrieves a list of VIPs in a channel.
	 *
	 * @param broadcaster The owner of the channel to get VIPs for.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getVips(
		broadcaster: UserIdResolvable,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixUserRelation>> {
		const response = await this._client.callApi<HelixPaginatedResponse<HelixUserRelationData>>({
			type: 'helix',
			url: 'channels/vips',
			scope: 'channel:read:vips',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				...makePaginationQuery(pagination)
			}
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
				scope: 'channel:read:vips',
				query: {
					broadcaster_id: extractUserId(broadcaster)
				}
			},
			this._client,
			data => new HelixUserRelation(data, this._client)
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
			scope: 'channel:read:vips',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				user_id: users.map(extractUserId)
			}
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
	 * @param broadcaster The ID of the broadcaster that’s granting VIP status to the user. This ID must match the user ID in the access token.
	 * @param user The ID of the user to add as a VIP in the broadcaster’s chat room.
	 */
	async addVip(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'channels/vips',
			method: 'POST',
			scope: 'channel:manage:vips',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				user_id: extractUserId(user)
			}
		});
	}

	/**
	 * Removes a VIP from the broadcaster’s chat room.
	 *
	 * @param broadcaster The ID of the broadcaster that’s removing VIP status from the user. This ID must match the user ID in the access token.
	 * @param user The ID of the user to remove as a VIP from the broadcaster’s chat room.
	 */
	async removeVip(broadcaster: UserIdResolvable, user: UserIdResolvable): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'channels/vips',
			method: 'DELETE',
			scope: 'channel:manage:vips',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				user_id: extractUserId(user)
			}
		});
	}
}
