import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

export interface EventSubChannelRedemptionUpdateEventData {
	/** @private */
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	user_id: string;
	user_name: string;
	user_input: string;
	status: 'fulfilled' | 'canceled';
	reward: {
		id: string;
		title: string;
		cost: number;
		prompt: string;
	};
	redeemed_at: string;
}

/**
 * An EventSub event representing a Channel Points redemption being updated
 */
export class EventSubChannelRedemptionUpdateEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelRedemptionUpdateEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the redemption being updated
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_user_id;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_user_id))!;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id))!;
	}

	/**
	 * The input text given by the user, if any, else an empty string
	 */
	get input(): string {
		return this._data.user_input;
	}

	/**
	 * The status of the redemption
	 */
	get status(): string {
		return this._data.status;
	}

	/**
	 * The ID of the reward item redeemed
	 */
	get rewardId(): string {
		return this._data.reward.id;
	}

	/**
	 * The title of the reward item redeemed
	 */
	get rewardTitle(): string {
		return this._data.reward.title;
	}

	/**
	 * The cost of the reward item redeemed
	 */
	get rewardCost(): number {
		return this._data.reward.cost;
	}

	/**
	 * The description of the reward item redeemed
	 */
	get rewardPrompt(): string {
		return this._data.reward.prompt;
	}

	/**
	 * The time when the user redeemed the reward
	 */
	get redeemDate(): Date {
		return new Date(this._data.redeemed_at);
	}
}
