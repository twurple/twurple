import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { EventSubChannelGoalType } from './common/EventSubChannelGoalType';

/** @private */
export interface EventSubChannelGoalBeginEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: EventSubChannelGoalType;
	description: string;
	current_amount: number;
	target_amount: number;
	started_at: Date;
}

/**
 * An EventSub event representing a creator goal starting in a channel.
 */
@rtfm<EventSubChannelGoalBeginEvent>('eventsub', 'EventSubChannelGoalBeginEvent', 'broadcasterId')
export class EventSubChannelGoalBeginEvent extends DataObject<EventSubChannelGoalBeginEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelGoalBeginEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the goal.
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
	 * The type of the goal. Can be either "follower" or "subscription".
	 */
	get type(): EventSubChannelGoalType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The description of the goal.
	 */
	get description(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * The current value of the goal.
	 */
	get currentAmount(): number {
		return this[rawDataSymbol].current_amount;
	}

	/**
	 * The target value of the goal.
	 */
	get targetAmount(): number {
		return this[rawDataSymbol].target_amount;
	}

	/**
	 * The time when the goal started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}
}
