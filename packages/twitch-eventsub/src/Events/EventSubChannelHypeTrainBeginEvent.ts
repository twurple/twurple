import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

/** @private */
export interface EventSubChannelHypeTrainBeginEventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	total: number;
	progress: number;
	goal: number;
	top_contributions: Contribution[];
	last_contribution: Contribution;
	started_at: string;
	expires_at: string;
}
interface Contribution {
	user_id: string;
	user_name: string;
	type: 'bits' | 'subscription';
	total: number;
}

/**
 * An EventSub event representing a Hype Train starting in a channel.
 */
export class EventSubChannelHypeTrainBeginEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelHypeTrainBeginEventData, client: ApiClient) {
		this._client = client;
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
	 * The total points already contributed to the hype train.
	 */
	get total(): number {
		return this._data.total;
	}

	/**
	 * The number of points contributed to the hype train at the current level.
	 */
	get progress(): number {
		return this._data.progress;
	}

	/**
	 * The number of points required to reach the next level.
	 */
	get goal(): number {
		return this._data.goal;
	}

	/**
	 * The top contributors for the hype train in terms of bits and subscriptions
	 */
	get topContributors(): Contribution[] {
		return this._data.top_contributions;
	}

	/**
	 * The last contribution to the hype train
	 */
	get lastContribution(): Contribution {
		return this._data.last_contribution;
	}

	/**
	 * The time when the hype train started
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The time when the hype train is expected to expire, unless a change of level occurs to extend the expiration
	 */
	get expiryDate(): Date {
		return new Date(this._data.expires_at);
	}
}
