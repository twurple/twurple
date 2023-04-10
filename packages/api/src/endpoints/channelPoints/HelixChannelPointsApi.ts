import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import { createBroadcasterQuery } from '@twurple/api-call';
import type { UserIdResolvable } from '@twurple/common';
import { extractUserId, rtfm } from '@twurple/common';
import {
	createCustomRewardBody,
	createCustomRewardChangeQuery,
	createCustomRewardsQuery,
	createRedemptionsForBroadcasterQuery,
	createRewardRedemptionsByIdsQuery,
	type HelixCustomRewardData,
	type HelixCustomRewardRedemptionData,
	type HelixCustomRewardRedemptionStatus,
	type HelixCustomRewardRedemptionTargetStatus
} from '../../interfaces/endpoints/channelPoints.external';
import {
	type HelixCreateCustomRewardData,
	type HelixCustomRewardRedemptionFilter,
	type HelixPaginatedCustomRewardRedemptionFilter,
	type HelixUpdateCustomRewardData
} from '../../interfaces/endpoints/channelPoints.input';
import { createGetByIdsQuery } from '../../interfaces/endpoints/generic.external';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginationQuery } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixCustomReward } from './HelixCustomReward';
import { HelixCustomRewardRedemption } from './HelixCustomRewardRedemption';

/**
 * The Helix API methods that deal with channel points.
 *
 * Can be accessed using `client.channelPoints` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const rewards = await api.channelPoints.getCustomRewards('125328655');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Channel points
 */
@rtfm('api', 'HelixChannelPointsApi')
export class HelixChannelPointsApi extends BaseApi {
	/**
	 * Gets all custom rewards for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the rewards for.
	 * @param onlyManageable Whether to only get rewards that can be managed by the API.
	 */
	async getCustomRewards(broadcaster: UserIdResolvable, onlyManageable?: boolean): Promise<HelixCustomReward[]> {
		const result = await this._client.callApi<HelixResponse<HelixCustomRewardData>>({
			type: 'helix',
			url: 'channel_points/custom_rewards',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:redemptions'],
			query: createCustomRewardsQuery(broadcaster, onlyManageable)
		});

		return result.data.map(data => new HelixCustomReward(data, this._client));
	}

	/**
	 * Gets custom rewards by IDs.
	 *
	 * @param broadcaster The broadcaster to get the rewards for.
	 * @param rewardIds The IDs of the rewards.
	 */
	async getCustomRewardsByIds(broadcaster: UserIdResolvable, rewardIds: string[]): Promise<HelixCustomReward[]> {
		if (!rewardIds.length) {
			return [];
		}
		const result = await this._client.callApi<HelixResponse<HelixCustomRewardData>>({
			type: 'helix',
			url: 'channel_points/custom_rewards',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:redemptions'],
			query: createGetByIdsQuery(broadcaster, rewardIds)
		});

		return result.data.map(data => new HelixCustomReward(data, this._client));
	}

	/**
	 * Gets a custom reward by ID.
	 *
	 * @param broadcaster The broadcaster to get the reward for.
	 * @param rewardId The ID of the reward.
	 */
	async getCustomRewardById(broadcaster: UserIdResolvable, rewardId: string): Promise<HelixCustomReward | null> {
		const rewards = await this.getCustomRewardsByIds(broadcaster, [rewardId]);
		return rewards.length ? rewards[0] : null;
	}

	/**
	 * Creates a new custom reward.
	 *
	 * @param broadcaster The broadcaster to create the reward for.
	 * @param data The reward data.
	 *
	 * @expandParams
	 */
	async createCustomReward(
		broadcaster: UserIdResolvable,
		data: HelixCreateCustomRewardData
	): Promise<HelixCustomReward> {
		const result = await this._client.callApi<HelixResponse<HelixCustomRewardData>>({
			type: 'helix',
			url: 'channel_points/custom_rewards',
			method: 'POST',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:redemptions'],
			query: createBroadcasterQuery(broadcaster),
			jsonBody: createCustomRewardBody(data)
		});

		return new HelixCustomReward(result.data[0], this._client);
	}

	/**
	 * Updates a custom reward.
	 *
	 * @param broadcaster The broadcaster to update the reward for.
	 * @param rewardId The ID of the reward.
	 * @param data The reward data.
	 */
	async updateCustomReward(
		broadcaster: UserIdResolvable,
		rewardId: string,
		data: HelixUpdateCustomRewardData
	): Promise<HelixCustomReward> {
		const result = await this._client.callApi<HelixResponse<HelixCustomRewardData>>({
			type: 'helix',
			url: 'channel_points/custom_rewards',
			method: 'PATCH',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:redemptions'],
			query: createCustomRewardChangeQuery(broadcaster, rewardId),
			jsonBody: createCustomRewardBody(data)
		});

		return new HelixCustomReward(result.data[0], this._client);
	}

	/**
	 * Deletes a custom reward.
	 *
	 * @param broadcaster The broadcaster to delete the reward for.
	 * @param rewardId The ID of the reward.
	 */
	async deleteCustomReward(broadcaster: UserIdResolvable, rewardId: string): Promise<void> {
		await this._client.callApi({
			type: 'helix',
			url: 'channel_points/custom_rewards',
			method: 'DELETE',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:redemptions'],
			query: createCustomRewardChangeQuery(broadcaster, rewardId)
		});
	}

	/**
	 * Gets custom reward redemptions by IDs.
	 *
	 * @param broadcaster The broadcaster to get the redemptions for.
	 * @param rewardId The ID of the reward.
	 * @param redemptionIds The IDs of the redemptions.
	 */
	async getRedemptionsByIds(
		broadcaster: UserIdResolvable,
		rewardId: string,
		redemptionIds: string[]
	): Promise<HelixCustomRewardRedemption[]> {
		if (!redemptionIds.length) {
			return [];
		}
		const result = await this._client.callApi<HelixResponse<HelixCustomRewardRedemptionData>>({
			type: 'helix',
			url: 'channel_points/custom_rewards/redemptions',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:redemptions'],
			query: createRewardRedemptionsByIdsQuery(broadcaster, rewardId, redemptionIds)
		});

		return result.data.map(data => new HelixCustomRewardRedemption(data, this._client));
	}

	/**
	 * Gets a custom reward redemption by ID.
	 *
	 * @param broadcaster The broadcaster to get the redemption for.
	 * @param rewardId The ID of the reward.
	 * @param redemptionId The ID of the redemption.
	 */
	async getRedemptionById(
		broadcaster: UserIdResolvable,
		rewardId: string,
		redemptionId: string
	): Promise<HelixCustomRewardRedemption | null> {
		const redemptions = await this.getRedemptionsByIds(broadcaster, rewardId, [redemptionId]);
		return redemptions.length ? redemptions[0] : null;
	}

	/**
	 * Gets custom reward redemptions for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the redemptions for.
	 * @param rewardId The ID of the reward.
	 * @param status The status of the redemptions to get.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getRedemptionsForBroadcaster(
		broadcaster: UserIdResolvable,
		rewardId: string,
		status: HelixCustomRewardRedemptionStatus,
		filter: HelixPaginatedCustomRewardRedemptionFilter
	): Promise<HelixPaginatedResult<HelixCustomRewardRedemption>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixCustomRewardRedemptionData>>({
			type: 'helix',
			url: 'channel_points/custom_rewards/redemptions',
			userId: extractUserId(broadcaster),
			scopes: ['channel:read:redemptions'],
			query: {
				...createRedemptionsForBroadcasterQuery(broadcaster, rewardId, status, filter),
				...createPaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixCustomRewardRedemption, this._client);
	}

	/**
	 * Creates a paginator for custom reward redemptions for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the redemptions for.
	 * @param rewardId The ID of the reward.
	 * @param status The status of the redemptions to get.
	 * @param filter
	 *
	 * @expandParams
	 */
	getRedemptionsForBroadcasterPaginated(
		broadcaster: UserIdResolvable,
		rewardId: string,
		status: HelixCustomRewardRedemptionStatus,
		filter: HelixCustomRewardRedemptionFilter
	): HelixPaginatedRequest<HelixCustomRewardRedemptionData, HelixCustomRewardRedemption> {
		return new HelixPaginatedRequest(
			{
				url: 'channel_points/custom_rewards/redemptions',
				userId: extractUserId(broadcaster),
				scopes: ['channel:read:redemptions'],
				query: createRedemptionsForBroadcasterQuery(broadcaster, rewardId, status, filter)
			},
			this._client,
			data => new HelixCustomRewardRedemption(data, this._client),
			50
		);
	}

	/**
	 * Updates the status of the given redemptions by IDs.
	 *
	 * @param broadcaster The broadcaster to update the redemptions for.
	 * @param rewardId The ID of the reward.
	 * @param redemptionIds The IDs of the redemptions to update.
	 * @param status The status to set for the redemptions.
	 */
	async updateRedemptionStatusByIds(
		broadcaster: UserIdResolvable,
		rewardId: string,
		redemptionIds: string[],
		status: HelixCustomRewardRedemptionTargetStatus
	): Promise<HelixCustomRewardRedemption[]> {
		if (!redemptionIds.length) {
			return [];
		}
		const result = await this._client.callApi<HelixResponse<HelixCustomRewardRedemptionData>>({
			type: 'helix',
			url: 'channel_points/custom_rewards/redemptions',
			method: 'PATCH',
			userId: extractUserId(broadcaster),
			scopes: ['channel:manage:redemptions'],
			query: createRewardRedemptionsByIdsQuery(broadcaster, rewardId, redemptionIds),
			jsonBody: {
				status
			}
		});

		return result.data.map(data => new HelixCustomRewardRedemption(data, this._client));
	}
}
