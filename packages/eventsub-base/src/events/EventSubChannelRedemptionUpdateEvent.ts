import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelRedemptionReward } from './common/EventSubChannelRedemptionReward';

/** @private */
export interface EventSubChannelRedemptionUpdateEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	user_input: string;
	status: 'fulfilled' | 'canceled';
	reward: EventSubChannelRedemptionReward;
	redeemed_at: string;
}

/**
 * An EventSub event representing a Channel Points redemption being updated.
 */
@rtfm<EventSubChannelRedemptionUpdateEvent>('eventsub-base', 'EventSubChannelRedemptionUpdateEvent', 'id')
export class EventSubChannelRedemptionUpdateEvent extends DataObject<EventSubChannelRedemptionUpdateEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelRedemptionUpdateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the redemption being updated.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The input text given by the user.
	 *
	 * If there is no input to be given, this is an empty string.
	 */
	get input(): string {
		return this[rawDataSymbol].user_input;
	}

	/**
	 * The status of the redemption.
	 */
	get status(): string {
		return this[rawDataSymbol].status;
	}

	/**
	 * The ID of the reward that was redeemed.
	 */
	get rewardId(): string {
		return this[rawDataSymbol].reward.id;
	}

	/**
	 * The title of the reward that was redeemed.
	 */
	get rewardTitle(): string {
		return this[rawDataSymbol].reward.title;
	}

	/**
	 * The cost of the reward that was redeemed.
	 */
	get rewardCost(): number {
		return this[rawDataSymbol].reward.cost;
	}

	/**
	 * The description of the reward that was redeemed.
	 */
	get rewardPrompt(): string {
		return this[rawDataSymbol].reward.prompt;
	}

	/**
	 * The time when the user redeemed the reward.
	 */
	get redemptionDate(): Date {
		return new Date(this[rawDataSymbol].redeemed_at);
	}
}
