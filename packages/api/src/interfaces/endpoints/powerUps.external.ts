import { extractUserId, type UserIdResolvable } from '@twurple/common';

/** @internal */
export function getAllPowerUpsQuery(broadcaster: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
	};
}

/** @internal */
export function getPowerUpsQuery(broadcaster: UserIdResolvable, rewardIds: string[]) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		id: rewardIds,
	};
}

/** @internal */
export function getPowerUpQuery(broadcaster: UserIdResolvable, rewardId: string) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		id: rewardId,
	};
}

/** @private */
export interface HelixCustomPowerUpImageData {
	url_1x: string;
	url_2x: string;
	url_4x: string;
}

/** @private */
export interface HelixCustomPowerUpMaxPerStreamSettingData {
	is_enabled: boolean;
	max_per_stream: number;
}

/** @private */
export interface HelixCustomPowerUpMaxPerUserPerStreamSettingData {
	is_enabled: boolean;
	max_per_user_per_stream: number;
}

/** @private */
export interface HelixCustomPowerUpGlobalCooldownSettingData {
	is_enabled: boolean;
	global_cooldown_seconds: number;
}

/** @private */
export interface HelixCustomPowerUpData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	id: string;
	image: HelixCustomPowerUpImageData | null;
	background_color: string;
	is_enabled: boolean;
	bits: number;
	title: string;
	prompt: string;
	is_user_input_required: boolean;
	max_per_stream_setting: HelixCustomPowerUpMaxPerStreamSettingData;
	max_per_user_per_stream_setting: HelixCustomPowerUpMaxPerUserPerStreamSettingData;
	global_cooldown_setting: HelixCustomPowerUpGlobalCooldownSettingData;
	is_paused: boolean;
	is_in_stock: boolean;
	default_image: HelixCustomPowerUpImageData;
	redemptions_redeemed_current_stream: number | null;
	cooldown_expires_at: string;
}
