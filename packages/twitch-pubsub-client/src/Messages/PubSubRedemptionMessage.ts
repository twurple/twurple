import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

export interface PubSubRedemptionMessageUserData {
	id: string;
	login: string;
	display_name: string;
}

export interface PubSubRedemptionMessageImageData {
	url_1x: string;
	url_2x: string;
	url_4x: string;
}

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

export type PubSubRedemptionStatus = 'FULFILLED' | 'UNFULFILLED';

export interface PubSubRedemptionMessageRedemptionData {
	id: string;
	user: PubSubRedemptionMessageUserData;
	channel_id: string;
	redeemed_at: string;
	reward: PubSubRedemptionMessageRewardData;
	user_input: string;
	status: PubSubRedemptionStatus;
}

export interface PubSubRedemptionMessageContent {
	timestamp: string;
	redemption: PubSubRedemptionMessageRedemptionData;
}

export interface PubSubRedemptionMessageData {
	type: 'reward-redeemed';
	data: PubSubRedemptionMessageContent;
}

/**
 * A message that informs about a user redeeming a custom channel points reward.
 */
export class PubSubRedemptionMessage {
	@Enumerable(false) private readonly _apiClient: ApiClient;

	/** @private */
	constructor(private readonly _data: PubSubRedemptionMessageData, apiClient: ApiClient) {
		this._apiClient = apiClient;
	}

	/**
	 * The internal redemption ID.
	 */
	get id(): string {
		return this._data.data.redemption.id;
	}

	/**
	 * The ID of the user that redeemed the reward.
	 */
	get userId(): string {
		return this._data.data.redemption.user.id;
	}

	/**
	 * The name of the user that redeemed the reward.
	 */
	get userName(): string {
		return this._data.data.redemption.user.login;
	}

	/**
	 * The display name of the user that redeemed the reward.
	 */
	get userDisplayName(): string {
		return this._data.data.redemption.user.display_name;
	}

	/**
	 * Retrieves more data about the user.
	 *
	 * @deprecated Use {@HelixUserApi#getUserById} instead.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._apiClient.helix.users.getUserById(this._data.data.redemption.user.id);
	}

	/**
	 * The ID of the channel where the reward was redeemed.
	 */
	get channelId(): string {
		return this._data.data.redemption.channel_id;
	}

	/**
	 * Retrieves more data about the channel where the reward was redeemed.
	 *
	 * @deprecated Use {@HelixUserApi#getUserById} instead.
	 */
	async getChannel(): Promise<HelixUser | null> {
		return this._apiClient.helix.users.getUserById(this._data.data.redemption.channel_id);
	}

	/**
	 * The date when the reward was redeemed.
	 */
	get redemptionDate(): Date {
		return new Date(this._data.data.redemption.redeemed_at);
	}

	/**
	 * The ID of the reward.
	 */
	get rewardId(): string {
		return this._data.data.redemption.reward.id;
	}

	/**
	 * The name of the reward.
	 */
	get rewardName(): string {
		return this._data.data.redemption.reward.title;
	}

	/**
	 * The prompt of the reward.
	 */
	get rewardPrompt(): string {
		return this._data.data.redemption.reward.prompt;
	}

	/**
	 * The cost of the reward, in channel points.
	 */
	get rewardCost(): number {
		return this._data.data.redemption.reward.cost;
	}

	/**
	 * Whether the reward gets added to the request queue.
	 */
	get rewardIsQueued(): boolean {
		return !this._data.data.redemption.reward.should_redemptions_skip_request_queue;
	}

	/**
	 * The image set associated with the reward.
	 */
	get rewardImage(): PubSubRedemptionMessageImageData {
		return this._data.data.redemption.reward.image;
	}

	/**
	 * The full message that was sent with the notification.
	 */
	get message(): string {
		return this._data.data.redemption.user_input;
	}

	/**
	 * The status of the redemption.
	 */
	get status(): PubSubRedemptionStatus {
		return this._data.data.redemption.status;
	}
}
