import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from 'twitch';

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

export interface PubSubRedemptionMessageRedemptionData {
	id: string;
	user: PubSubRedemptionMessageUserData;
	channel_id: string;
	redeemed_at: string;
	reward: PubSubRedemptionMessageRewardData;
	user_input: string;
	status: 'FULFILLED' | 'UNFULFILLED';
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
export default class PubSubRedemptionMessage {
	@NonEnumerable private readonly _twitchClient: TwitchClient;

	/** @private */
	constructor(private readonly _data: PubSubRedemptionMessageData, twitchClient: TwitchClient) {
		this._twitchClient = twitchClient;
	}

	/**
	 * The internal redemption ID.
	 */
	get id() {
		return this._data.data.redemption.id;
	}

	/**
	 * The ID of the user that redeemed the reward.
	 */
	get userId() {
		return this._data.data.redemption.user.id;
	}

	/**
	 * The name of the user that redeemed the reward.
	 */
	get userName() {
		return this._data.data.redemption.user.login;
	}

	/**
	 * The display name of the user that redeemed the reward.
	 */
	get userDisplayName() {
		return this._data.data.redemption.user.display_name;
	}

	/**
	 * Retrieves more data about the user.
	 */
	async getUser() {
		return this._twitchClient.helix.users.getUserById(this._data.data.redemption.user.id);
	}

	/**
	 * The ID of the channel where the reward was redeemed.
	 */
	get channelId() {
		return this._data.data.redemption.channel_id;
	}

	/**
	 * Retrieves more data about the channel where the reward was redeemed.
	 */
	async getChannel() {
		return this._twitchClient.helix.users.getUserById(this._data.data.redemption.channel_id);
	}

	get redemptionDate() {
		return new Date(this._data.data.redemption.redeemed_at);
	}

	/**
	 * The ID of the reward.
	 */
	get rewardId() {
		return this._data.data.redemption.reward.id;
	}

	/**
	 * The name of the reward.
	 */
	get rewardName() {
		return this._data.data.redemption.reward.title;
	}

	/**
	 * The prompt of the reward.
	 */
	get rewardPrompt() {
		return this._data.data.redemption.reward.prompt;
	}

	/**
	 * The cost of the reward, in channel points.
	 */
	get rewardCost() {
		return this._data.data.redemption.reward.cost;
	}

	/**
	 * Whether the reward gets added to the request queue.
	 */
	get rewardIsQueued() {
		return !this._data.data.redemption.reward.should_redemptions_skip_request_queue;
	}

	/**
	 * The full message that was sent with the notification.
	 */
	get message() {
		return this._data.data.redemption.user_input;
	}

	/**
	 * The status of the redemption.
	 */
	get status() {
		return this._data.data.redemption.status;
	}
}
