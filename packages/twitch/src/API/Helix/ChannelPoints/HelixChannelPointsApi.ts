import { TwitchApiCallType } from 'twitch-api-call';
import { rtfm } from 'twitch-common';
import type { UserIdResolvable } from '../../../Toolkit/UserTools';
import { extractUserId } from '../../../Toolkit/UserTools';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixForwardPagination } from '../HelixPagination';
import type { HelixPaginatedResponse, HelixResponse } from '../HelixResponse';
import type { HelixCustomRewardData } from './HelixCustomReward';
import { HelixCustomReward } from './HelixCustomReward';
import type {
	HelixCustomRewardRedemptionData,
	HelixCustomRewardRedemptionStatus,
	HelixCustomRewardRedemptionTargetStatus
} from './HelixCustomRewardRedemption';
import { HelixCustomRewardRedemption } from './HelixCustomRewardRedemption';

/**
 * Data to create a new custom reward.
 */
export interface HelixCreateCustomRewardData {
	/**
	 * The title of the reward.
	 */
	title: string;

	/**
	 * The channel points cost of the reward.
	 */
	cost: number;

	/**
	 * The prompt shown to users when redeeming the reward.
	 */
	prompt?: string;

	/**
	 * Whether the reward is enabled (shown to users).
	 */
	isEnabled?: boolean;

	/**
	 * The hex code of the background color of the reward.
	 */
	backgroundColor?: string;

	/**
	 * Whether the reward requires user input to be redeemed.
	 */
	userInputRequired?: boolean;

	/**
	 * The maximum number of redemptions of the reward per stream. 0 or `null` means no limit.
	 */
	maxRedemptionsPerStream?: number | null;

	/**
	 * The maximum number of redemptions of the reward per stream for each user. 0 or `null` means no limit.
	 */
	maxRedemptionsPerUserPerStream?: number | null;

	/**
	 * The cooldown between two redemptions of the reward, in seconds. 0 or `null` means no cooldown.
	 */
	globalCooldown?: number | null;

	/**
	 * Whether the redemption should automatically set its status to fulfilled.
	 */
	autoFulfill?: boolean;
}

/**
 * Data to update an existing custom reward.
 *
 * @inheritDoc
 */
export interface HelixUpdateCustomRewardData extends Partial<HelixCreateCustomRewardData> {
	/**
	 * Whether the reward is paused. If true, users can't redeem it.
	 */
	isPaused?: boolean;
}

/**
 * Filters for the custom reward redemptions request.
 */
export interface HelixCustomRewardRedemptionFilter {
	/**
	 * Whether to put the newest redemptions first.
	 *
	 * Oldest redemptions are shown first by default.
	 */
	newestFirst?: boolean;
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedCustomRewardRedemptionFilter
	extends HelixCustomRewardRedemptionFilter,
		HelixForwardPagination {}

@rtfm('twitch', 'HelixChannelPointsApi')
export class HelixChannelPointsApi extends BaseApi {
	/**
	 * Retrieves all custom rewards for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve the rewards for.
	 * @param onlyManageable Whether to only retrieve rewards that can be managed by the API.
	 */
	async getCustomRewards(broadcaster: UserIdResolvable, onlyManageable?: boolean): Promise<HelixCustomReward[]> {
		const result = await this._client.callApi<HelixResponse<HelixCustomRewardData>>({
			type: TwitchApiCallType.Helix,
			url: 'channel_points/custom_rewards',
			scope: 'channel:read:redemptions',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				only_manageable_rewards: onlyManageable?.toString()
			}
		});

		return result.data.map(data => new HelixCustomReward(data, this._client));
	}

	/**
	 * Retrieves custom rewards by IDs.
	 *
	 * @param broadcaster The broadcaster to retrieve the rewards for.
	 * @param rewardIds The IDs of the rewards.
	 */
	async getCustomRewardsByIds(broadcaster: UserIdResolvable, rewardIds: string[]): Promise<HelixCustomReward[]> {
		if (!rewardIds.length) {
			return [];
		}
		const result = await this._client.callApi<HelixResponse<HelixCustomRewardData>>({
			type: TwitchApiCallType.Helix,
			url: 'channel_points/custom_rewards',
			scope: 'channel:read:redemptions',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				id: rewardIds
			}
		});

		return result.data.map(data => new HelixCustomReward(data, this._client));
	}

	/**
	 * Retrieves a custom reward by ID.
	 *
	 * @param broadcaster The broadcaster to retrieve the reward for.
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
			type: TwitchApiCallType.Helix,
			url: 'channel_points/custom_rewards',
			method: 'POST',
			scope: 'channel:manage:redemptions',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			},
			jsonBody: HelixChannelPointsApi._transformRewardData(data)
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
			type: TwitchApiCallType.Helix,
			url: 'channel_points/custom_rewards',
			method: 'PATCH',
			scope: 'channel:manage:redemptions',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				id: rewardId
			},
			jsonBody: HelixChannelPointsApi._transformRewardData(data)
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
			type: TwitchApiCallType.Helix,
			url: 'channel_points/custom_rewards',
			method: 'DELETE',
			scope: 'channel:manage:redemptions',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				id: rewardId
			}
		});
	}

	/**
	 * Retrieves custom reward redemptions by IDs.
	 *
	 * @param broadcaster The broadcaster to retrieve the redemptions for.
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
			type: TwitchApiCallType.Helix,
			url: 'channel_points/custom_rewards/redemptions',
			scope: 'channel:read:redemptions',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				reward_id: rewardId,
				id: redemptionIds
			}
		});

		return result.data.map(data => new HelixCustomRewardRedemption(data, this._client));
	}

	/**
	 * Retrieves a custom reward redemption by ID.
	 *
	 * @param broadcaster The broadcaster to retrieve the redemption for.
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
	 * Retrieves custom reward redemptions for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve the redemptions for.
	 * @param rewardId The ID of the reward.
	 * @param status The status of the redemptions to retrieve.
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
			type: TwitchApiCallType.Helix,
			url: 'channel_points/custom_rewards/redemptions',
			scope: 'channel:read:redemptions',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				reward_id: rewardId,
				status,
				sort: filter.newestFirst ? 'NEWEST' : 'OLDEST',
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixCustomRewardRedemption, this._client);
	}

	/**
	 * Creates a paginator for custom reward redemptions for the given broadcaster.
	 *
	 * @param broadcaster The broadcaster to retrieve the redemptions for.
	 * @param rewardId The ID of the reward.
	 * @param status The status of the redemptions to retrieve.
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
		return new HelixPaginatedRequest<HelixCustomRewardRedemptionData, HelixCustomRewardRedemption>(
			{
				url: 'channel_points/custom_rewards/redemptions',
				scope: 'channel:read:redemptions',
				query: {
					broadcaster_id: extractUserId(broadcaster),
					reward_id: rewardId,
					status,
					sort: filter.newestFirst ? 'NEWEST' : 'OLDEST'
				}
			},
			this._client,
			data => new HelixCustomRewardRedemption(data, this._client)
		);
	}

	/**
	 * Updates the status of the given redemptions by IDs.
	 *
	 * @param broadcaster The broadcaster to retrieve the redemptions for.
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
			type: TwitchApiCallType.Helix,
			url: 'channel_points/custom_rewards/redemptions',
			method: 'PATCH',
			scope: 'channel:manage:redemptions',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				reward_id: rewardId,
				id: redemptionIds
			},
			jsonBody: {
				status
			}
		});

		return result.data.map(data => new HelixCustomRewardRedemption(data, this._client));
	}

	private static _transformRewardData(data: HelixCreateCustomRewardData | HelixUpdateCustomRewardData) {
		const result: Record<string, unknown> = {
			title: data.title,
			cost: data.cost,
			prompt: data.prompt,
			background_color: data.backgroundColor,
			is_enabled: data.isEnabled,
			is_user_input_required: data.userInputRequired,
			should_redemptions_skip_request_queue: data.autoFulfill
		};

		if (data.maxRedemptionsPerStream !== undefined) {
			result.is_max_per_stream_enabled = !!data.maxRedemptionsPerStream;
			result.max_per_stream = data.maxRedemptionsPerStream ?? 0;
		}

		if (data.maxRedemptionsPerUserPerStream !== undefined) {
			result.is_max_per_user_per_stream_enabled = !!data.maxRedemptionsPerUserPerStream;
			result.max_per_user_per_stream = data.maxRedemptionsPerUserPerStream ?? 0;
		}

		if (data.globalCooldown !== undefined) {
			result.is_global_cooldown_enabled = !!data.globalCooldown;
			result.global_cooldown_seconds = data.globalCooldown ?? 0;
		}

		if ('isPaused' in data) {
			result.is_paused = data.isPaused;
		}

		return result;
	}
}
