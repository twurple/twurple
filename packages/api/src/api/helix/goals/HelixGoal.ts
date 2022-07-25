import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';

export type HelixGoalType = 'follower' | 'subscription' | 'subscription_count' | 'new_subscription_count';

/** @private */
export interface HelixGoalData {
	id: string;
	broadcaster_id: string;
	broadcaster_name: string;
	broadcaster_login: string;
	type: HelixGoalType;
	description: string;
	current_amount: number;
	target_amount: number;
	created_at: Date;
}

/**
 * A creator goal.
 */
@rtfm<HelixGoal>('api', 'HelixGoal', 'id')
export class HelixGoal extends DataObject<HelixGoalData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixGoalData, client: ApiClient) {
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
	 * The ID of the broadcaster the goal belongs to.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The display name of the broadcaster the goal belongs to.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * The name of the broadcaster the goal belongs to.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
	}

	/**
	 * The type of the goal. Can be one of "follower", "subscription", "subscription_count" or "new_subscription_count".
	 */
	get type(): HelixGoalType {
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
	 * The date and time when the goal was created.
	 */
	get creationDate(): Date {
		return this[rawDataSymbol].created_at;
	}
}
