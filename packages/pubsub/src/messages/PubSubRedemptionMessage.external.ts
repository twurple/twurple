/** @private */
export interface PubSubRedemptionMessageUserData {
	id: string;
	login: string;
	display_name: string;
}

/** @private */
export interface PubSubRedemptionMessageImageData {
	url_1x: string;
	url_2x: string;
	url_4x: string;
}

/** @private */
export interface PubSubRedemptionMessageRewardData {
	id: string;
	channel_id: string;
	title: string;
	prompt: string;
	cost: number;
	is_user_input_required: boolean;
	is_sub_only: boolean;
	image: PubSubRedemptionMessageImageData;
	default_image: PubSubRedemptionMessageImageData;
	background_color: string;
	is_enabled: boolean;
	is_paused: boolean;
	is_in_stock: boolean;
	max_per_stream: {
		is_enabled: boolean;
		max_per_stream: number;
	};
	should_redemptions_skip_request_queue: boolean;
}

/** @private */
export type PubSubRedemptionStatus = 'FULFILLED' | 'UNFULFILLED';

/** @private */
export interface PubSubRedemptionMessageRedemptionData {
	id: string;
	user: PubSubRedemptionMessageUserData;
	channel_id: string;
	redeemed_at: string;
	reward: PubSubRedemptionMessageRewardData;
	user_input: string;
	status: PubSubRedemptionStatus;
}

/** @private */
export interface PubSubRedemptionMessageContent {
	timestamp: string;
	redemption: PubSubRedemptionMessageRedemptionData;
}

/** @private */
export interface PubSubRedemptionMessageData {
	type: 'reward-redeemed';
	data: PubSubRedemptionMessageContent;
}
