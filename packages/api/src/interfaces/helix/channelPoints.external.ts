import { extractUserId, type UserIdResolvable } from '@twurple/common';
import {
	type HelixCreateCustomRewardData,
	type HelixCustomRewardRedemptionFilter,
	type HelixUpdateCustomRewardData
} from './channelPoints.input';

/** @private */
export function createCustomRewardsQuery(broadcaster: UserIdResolvable, onlyManageable?: boolean) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		only_manageable_rewards: onlyManageable?.toString()
	};
}

/** @private */
export function createCustomRewardChangeQuery(broadcaster: UserIdResolvable, rewardId: string) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		id: rewardId
	};
}

/** @private */
export function createCustomRewardBody(data: HelixCreateCustomRewardData | HelixUpdateCustomRewardData) {
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

/** @private */
export function createRewardRedemptionsByIdsQuery(
	broadcaster: UserIdResolvable,
	rewardId: string,
	redemptionIds: string[]
) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		reward_id: rewardId,
		id: redemptionIds
	};
}

/**
 * The possible statuses of a custom Channel Points reward redemption you can set.
 */
export type HelixCustomRewardRedemptionTargetStatus = 'FULFILLED' | 'CANCELED';
/**
 * The possible statuses of a custom Channel Points reward redemption.
 */
export type HelixCustomRewardRedemptionStatus = 'UNFULFILLED' | HelixCustomRewardRedemptionTargetStatus;

/** @private */
export interface HelixCustomRewardRedemptionRewardData {
	id: string;
	title: string;
	prompt: string;
	cost: number;
}

/** @private */
export interface HelixCustomRewardRedemptionData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	user_input: string;
	status: HelixCustomRewardRedemptionStatus;
	redeemed_at: string;
	reward: HelixCustomRewardRedemptionRewardData;
}

/** @private */
export function createRedemptionsForBroadcasterQuery(
	broadcaster: UserIdResolvable,
	rewardId: string,
	status: HelixCustomRewardRedemptionStatus,
	filter: HelixCustomRewardRedemptionFilter
) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		reward_id: rewardId,
		status,
		sort: filter.newestFirst ? 'NEWEST' : 'OLDEST'
	};
}

/** @private */
export interface HelixCustomRewardImageData {
	url_1x: string;
	url_2x: string;
	url_4x: string;
}

/** @private */
export interface HelixCustomRewardMaxPerStreamSettingData {
	is_enabled: boolean;
	max_per_stream: number;
}

/** @private */
export interface HelixCustomRewardMaxPerUserPerStreamSettingData {
	is_enabled: boolean;
	max_per_user_per_stream: number;
}

/** @private */
export interface HelixCustomRewardGlobalCooldownSettingData {
	is_enabled: boolean;
	global_cooldown_seconds: number;
}

/** @private */
export interface HelixCustomRewardData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	id: string;
	image: HelixCustomRewardImageData | null;
	background_color: string;
	is_enabled: boolean;
	cost: number;
	title: string;
	prompt: string;
	is_user_input_required: boolean;
	max_per_stream_setting: HelixCustomRewardMaxPerStreamSettingData;
	max_per_user_per_stream_setting: HelixCustomRewardMaxPerUserPerStreamSettingData;
	global_cooldown_setting: HelixCustomRewardGlobalCooldownSettingData;
	is_paused: boolean;
	is_in_stock: boolean;
	default_image: HelixCustomRewardImageData;
	should_redemptions_skip_request_queue: boolean;
	redemptions_redeemed_current_stream: number | null;
	cooldown_expires_at: string;
}
