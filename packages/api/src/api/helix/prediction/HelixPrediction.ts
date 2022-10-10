import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, HellFreezesOverError, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';
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
@rtfm<HelixPrediction>('api', 'HelixPrediction', 'id')
export class HelixPrediction extends DataObject<HelixPredictionData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixPredictionData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the prediction.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
	}

	/**
	 * The title of the prediction.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The status of the prediction.
	 */
	get status(): HelixPredictionStatus {
		return this[rawDataSymbol].status;
	}

	/**
	 * The time after which the prediction will be automatically locked, in seconds from creation.
	 */
	get autoLockAfter(): number {
		return this[rawDataSymbol].prediction_window;
	}

	/**
	 * The date when the prediction started.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The date when the prediction ended, or null if it didn't end yet.
	 */
	get endDate(): Date | null {
		return this[rawDataSymbol].ended_at ? new Date(this[rawDataSymbol].ended_at) : null;
	}

	/**
	 * The date when the prediction was locked, or null if it wasn't locked yet.
	 */
	get lockDate(): Date | null {
		return this[rawDataSymbol].locked_at ? new Date(this[rawDataSymbol].locked_at) : null;
	}

	/**
	 * The possible outcomes of the prediction.
	 */
	get outcomes(): HelixPredictionOutcome[] {
		return this[rawDataSymbol].outcomes.map(data => new HelixPredictionOutcome(data, this._client));
	}

	/**
	 * The ID of the winning outcome, or null if the prediction was canceled.
	 */
	get winningOutcomeId(): string | null {
		return this[rawDataSymbol].winning_outcome_id;
	}

	/**
	 * The winning outcome, or null if the prediction was canceled.
	 */
	get winningOutcome(): HelixPredictionOutcome | null {
		if (this[rawDataSymbol].winning_outcome_id === null) {
			return null;
		}

		const found = this[rawDataSymbol].outcomes.find(o => o.id === this[rawDataSymbol].winning_outcome_id);
		if (!found) {
			throw new HellFreezesOverError('Winning outcome not found in outcomes array');
		}
		return new HelixPredictionOutcome(found, this._client);
	}
}
