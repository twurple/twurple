import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

/** @private */
export interface EventSubChannelHypeTrainEndEventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
	level: number;
	total: number;
	top_contributions: Contribution[];
	started_at: string;
	ended_at: string;
	cooldown_ends_at: string;
}
interface Contribution {
	user_id: string;
	user_name: string;
	type: 'bits' | 'subscription';
	total: number;
}

/**
 * An EventSub event representing the end of a Hype train event.
 */
export class EventSubChannelHypeTrainEndEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelHypeTrainEndEventData, client: ApiClient) {
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
	 * The level the Hype Train ended on
	 */
	get level(): number {
		return this._data.level;
	}

	/**
	 * The total points contributed to the Hype Train
	 */
	get total(): number {
		return this._data.total;
	}

	/**
	 * The contributors with the most points, for both bits and subscriptions.
	 */
	get topContributions(): Contribution[] {
		return this._data.top_contributions;
	}

	/**
	 * The time when the Hype Train started.
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The time when the Hype Train ended.
	 */
	get endDate(): Date {
		return new Date(this._data.ended_at);
	}

	/**
	 * The time when the Hype Train cooldown ends
	 */
	get cooldownEndDate(): Date {
		return new Date(this._data.cooldown_ends_at);
	}
}
