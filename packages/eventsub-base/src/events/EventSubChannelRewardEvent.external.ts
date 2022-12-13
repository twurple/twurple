/** @private */
export interface EventSubChannelRewardMaxPerStreamData {
	is_enabled: boolean;
	value: number | null;
}

/** @private */
export interface EventSubChannelRewardCooldownData {
	is_enabled: boolean;
	seconds: number | null;
}

/** @private */
export interface EventSubChannelRewardImageData {
	url_1x: string;
	url_2x: string;
	url_4x: string;
}

/** @private */
export type EventSubChannelRewardImageScale = 1 | 2 | 4;

/** @private */
export interface EventSubChannelRewardEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	is_enabled: boolean;
	is_paused: boolean;
	is_in_stock: boolean;
	title: string;
	cost: number;
	prompt: string;
	is_user_input_required: boolean;
	should_redemptions_skip_request_queue: boolean;
	cooldown_expires_at: string | null;
	redemptions_redeemed_current_stream: number | null;
	max_per_stream: EventSubChannelRewardMaxPerStreamData;
	max_per_user_per_stream: EventSubChannelRewardMaxPerStreamData;
	global_cooldown: EventSubChannelRewardCooldownData;
	background_color: string;
	image: EventSubChannelRewardImageData | null;
	default_image: EventSubChannelRewardImageData;
}
