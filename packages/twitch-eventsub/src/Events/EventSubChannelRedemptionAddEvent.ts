import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelRedemptionReward } from './Common/EventSubChannelRedemptionReward';

/** @private */
export interface EventSubChannelRedemptionAddEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	user_input: string;
	status: 'unfulfilled' | 'unknown' | 'fulfilled' | 'canceled';
	reward: EventSubChannelRedemptionReward;
	redeemed_at: string;
}

/**
 * An EventSub event representing a Channel Points redemption.
 */
@rtfm<EventSubChannelRedemptionAddEvent>('eventsub', 'EventSubChannelRedemptionAddEvent', 'id')
export class EventSubChannelRedemptionAddEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelRedemptionAddEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the redemption.
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
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_user_login;
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
	 * The name of the user.
	 */
	get userName(): string {
		return this._data.user_login;
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
	 * The input text given by the user.
	 *
	 * If there is no input to be given, this is an empty string.
	 */
	get input(): string {
		return this._data.user_input;
	}

	/**
	 * The status of the redemption.
	 */
	get status(): string {
		return this._data.status;
	}

	/**
	 * The ID of the reward that was redeemed.
	 */
	get rewardId(): string {
		return this._data.reward.id;
	}

	/**
	 * The title of the reward that was redeemed.
	 */
	get rewardTitle(): string {
		return this._data.reward.title;
	}

	/**
	 * The cost of the reward that was redeemed.
	 */
	get rewardCost(): number {
		return this._data.reward.cost;
	}

	/**
	 * The description of the reward that was redeemed.
	 */
	get rewardPrompt(): string {
		return this._data.reward.prompt;
	}

	/**
	 * The time when the user redeemed the reward.
	 */
	get redeemedAt(): Date {
		return new Date(this._data.redeemed_at);
	}
}
