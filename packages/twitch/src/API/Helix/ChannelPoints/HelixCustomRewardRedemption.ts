import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { HelixUser } from '../User/HelixUser';
import type { ApiClient } from '../../../ApiClient';
import type { HelixCustomReward } from './HelixCustomReward';

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
	broadcaster_name: string;
	broadcaster_id: string;
	id: string;
	user_id: string;
	user_name: string;
	user_input: string;
	status: HelixCustomRewardRedemptionStatus;
	redeemed_at: string;
	reward: HelixCustomRewardRedemptionRewardData;
}

/**
 * A redemption of a custom Channel Points reward.
 */
@rtfm<HelixCustomRewardRedemption>('twitch', 'HelixCustomRewardRedemption', 'id')
export class HelixCustomRewardRedemption {
	@Enumerable(false) private readonly _data: HelixCustomRewardRedemptionData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixCustomRewardRedemptionData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the redemption.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The ID of the broadcaster where the reward was redeemed.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * The display name of the broadcaster where the reward was redeemed.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster where the reward was redeemed.
	 */
	async getBroadcaster(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * The ID of the user that redeemed the reward.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The display name of the user that redeemed the reward.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user that redeemed the reward.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	/**
	 * The text the user wrote when redeeming the reward.
	 */
	get userInput(): string {
		return this._data.user_input;
	}

	/**
	 * Whether the redemption was fulfilled.
	 */
	get isFulfilled(): boolean {
		return this._data.status === 'FULFILLED';
	}

	/**
	 * Whether the redemption was canceled.
	 */
	get isCanceled(): boolean {
		return this._data.status === 'CANCELED';
	}

	/**
	 * The date and time when the reward was redeemed.
	 */
	get redemptionDate(): Date {
		return new Date(this._data.redeemed_at);
	}

	/**
	 * The ID of the reward that was redeemed.
	 */
	get rewardId(): string {
		return this._data.reward.id;
	}

	/**
	 * Retrieves more info about the reward that was redeemed.
	 */
	async getReward(): Promise<HelixCustomReward> {
		return (await this._client.helix.channelPoints.getCustomRewardById(
			this._data.broadcaster_id,
			this._data.reward.id
		))!;
	}

	/**
	 * The title of the reward that was redeemed.
	 */
	get rewardTitle(): string {
		return this._data.reward.title;
	}

	/**
	 * The prompt of the reward that was redeemed.
	 */
	get rewardPrompt(): string {
		return this._data.reward.prompt;
	}

	/**
	 * The cost of the reward that was redeemed.
	 */
	get rewardCost(): number {
		return this._data.reward.cost;
	}
}
