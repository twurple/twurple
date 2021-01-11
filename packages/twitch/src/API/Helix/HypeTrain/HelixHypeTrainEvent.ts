import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';
import type { HelixHypeTrainContributionData } from './HelixHypeTrainContribution';
import { HelixHypeTrainContribution } from './HelixHypeTrainContribution';

/** @private */
export interface HelixHypeTrainEventData {
	id: string;
	broadcaster_id: string;
	cooldown_end_time: string;
	expires_at: string;
	goal: number;
	last_contribution: HelixHypeTrainContributionData;
	level: number;
	started_at: string;
	top_contributions: HelixHypeTrainContributionData[];
	total: number;
}

/**
 * A Hype Train event.
 */
@rtfm<HelixHypeTrainEvent>('twitch', 'HelixHypeTrainEvent', 'id')
export class HelixHypeTrainEvent {
	@Enumerable(false) private readonly _data: HelixHypeTrainEventData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixHypeTrainEventData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the Hype Train event.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The user ID of the broadcaster where the Hype Train event was triggered.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * Retrieves more information about the broadcaster where the Hype Train event was triggered.
	 */
	async getBroadcaster(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * The level of the Hype Train event.
	 */
	get level(): number {
		return this._data.level;
	}

	/**
	 * The time when the Hype Train started.
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The time when the Hype Train is set to expire.
	 */
	get expiryDate(): Date {
		return new Date(this._data.expires_at);
	}

	/**
	 * The total amount of progress points of the Hype Train event.
	 */
	get total(): number {
		return this._data.total;
	}

	/**
	 * The last contribution to the Hype Train event.
	 */
	get lastContribution(): HelixHypeTrainContribution {
		return new HelixHypeTrainContribution(this._data.last_contribution, this._client);
	}

	/**
	 * Array list of the top contributions to the Hype Train event for bits and subs.
	 */
	get topContributions(): HelixHypeTrainContribution[] {
		return this._data.top_contributions.map(cont => new HelixHypeTrainContribution(cont, this._client));
	}
}
