import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';
import type { HelixPredictionOutcomeData } from './HelixPredictionOutcome';
import { HelixPredictionOutcome } from './HelixPredictionOutcome';

/**
 * The different statuses a prediction can have.
 */
export type HelixPredictionStatus = 'ACTIVE' | 'RESOLVED' | 'CANCELED' | 'LOCKED';

/** @private */
export interface HelixPredictionData {
	id: string;
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	title: string;
	winning_outcome_id: string | null;
	outcomes: HelixPredictionOutcomeData[];
	prediction_window: number;
	status: HelixPredictionStatus;
	created_at: string;
	ended_at: string;
	locked_at: string;
}

/**
 * A channel prediction.
 */
export class HelixPrediction {
	@Enumerable(false) private readonly _data: HelixPredictionData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixPredictionData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the prediction.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_id))!;
	}

	/**
	 * The title of the prediction.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The status of the prediction.
	 */
	get status(): HelixPredictionStatus {
		return this._data.status;
	}

	/**
	 * The time after which the prediction will be automatically locked, in seconds from creation.
	 */
	get autoLockAfter(): number {
		return this._data.prediction_window;
	}

	/**
	 * The date when the prediction started.
	 */
	get creationDate(): Date {
		return new Date(this._data.created_at);
	}

	/**
	 * The date when the prediction ended, or null if it didn't end yet.
	 */
	get endDate(): Date | null {
		return this._data.ended_at ? new Date(this._data.ended_at) : null;
	}

	/**
	 * The date when the prediction was locked, or null if it wasn't locked yet.
	 */
	get lockDate(): Date | null {
		return this._data.locked_at ? new Date(this._data.locked_at) : null;
	}

	/**
	 * The possible outcomes of the prediction.
	 */
	get outcomes(): HelixPredictionOutcome[] {
		return this._data.outcomes.map(data => new HelixPredictionOutcome(data, this._client));
	}
}
