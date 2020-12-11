import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

export interface EventSubChannelHypeTrainProgressEventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	level: number;
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
 * An EventSub event representing progress towards the Hype Train goal
 */
export class EventSubChannelHypeTrainProgressEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	constructor(private readonly _data: EventSubChannelHypeTrainProgressEventData, client: ApiClient) {
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
	 * The current level of the hype train.
	 */
	get level(): number {
		return this._data.level;
	}

	/**
	 * The total points contributed to the hype train.
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
	 * The contributors with the most points, for both bits and subscriptions.
	 */
	get topContributions(): Contribution[] {
		return this._data.top_contributions;
	}

	/**
	 * The most recent contribution.
	 */
	get lastContribution(): Contribution {
		return this._data.last_contribution;
	}

	/**
	 * The time when the hype train started.
	 */
	get startedAt(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The time when the hype train is expected to end, unless extended by reaching the goal.
	 */
	get expiresAt(): Date {
		return new Date(this.expiresAt);
	}
}
