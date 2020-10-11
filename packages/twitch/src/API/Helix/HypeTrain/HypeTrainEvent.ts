import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';
import type { HypeTrainContributionData } from './HypeTrainContribution';
import { HypeTrainContribution } from './HypeTrainContribution';

/** @private */
export interface HypeTrainEventData {
	id: string;
	broadcaster_id: string;
	cooldown_end_time: string;
	expires_at: string;
	goal: number;
	last_contribution: HypeTrainContributionData;
	level: number;
	started_at: string;
	top_contributions: HypeTrainContributionData[];
	total: number;
}

/**
 * A hype train event.
 */
export class HypeTrainEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private _data: HypeTrainEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The id of the hype train event.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The user ID of the broadcaster where the hype train event was triggered.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * Retrieves more information about the broadcaster where the hype train event was triggered.
	 */
	async getBroadcaster(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * The level of the hype train event.
	 */
	get level(): number {
		return this._data.level;
	}

	/**
	 * The start date of the hype train event.
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The expiration date of the hype train event.
	 */
	get expiryDate(): Date {
		return new Date(this._data.expires_at);
	}

	/**
	 * The total amount of of the hype train event.
	 */
	get total(): number {
		return this._data.total;
	}

	/**
	 * The last contribution to the hype train event.
	 */
	get lastContribution(): HypeTrainContribution {
		return new HypeTrainContribution(this._data.last_contribution, this._client);
	}

	/**
	 * Array list of the top contributions to the hype train event for bits and subs.
	 */
	get topContributions(): HypeTrainContribution[] {
		return this._data.top_contributions.map(cont => new HypeTrainContribution(cont, this._client));
	}
}
