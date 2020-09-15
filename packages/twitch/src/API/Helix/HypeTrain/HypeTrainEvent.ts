import { Enumerable } from '@d-fischer/shared-utils';
import { ApiClient } from '../../../ApiClient';
import { HypeTrainContributor } from '../HypeTrain/HypeTrainContributor';

/** @private */
export interface HypeTrainEventData {
	eventId: string;
	broadcasterId: string;
	level: string;
	startedAt: string;
	expiresAt: string;
	total: string;
	lastContribution: HypeTrainContributor;
	topContributions: HypeTrainContributor[];
}

/**
 * A hypetrain event.
 */
export class HypeTrainEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(/** @private */ protected _data: HypeTrainEventData, client: ApiClient) {
		this._client = client;
		this._data.lastContribution = new HypeTrainContributor(_data.lastContribution);

		_data.topContributions.forEach(contributor =>
			this._data.topContributions.push(new HypeTrainContributor(contributor))
		);
	}

	/**
	 * The id of the hypetrain event.
	 */
	get id() {
		return this._data.eventId;
	}

	/**
	 * The userid of the broadcaster where the hypetrain event was triggered.
	 */
	get broadcasterId() {
		return this._data.broadcasterId;
	}

	/**
	 * The level of the hypetrain event.
	 */
	get level() {
		return this._data.level;
	}

	/**
	 * The start time of the hypetrain event.
	 */
	get startedAt() {
		return this._data.startedAt;
	}

	/**
	 * The expiration date of the hypetrain event.
	 */
	get expiresAt() {
		return this._data.expiresAt;
	}

	/**
	 * The total amount of of the hypetrain event.
	 */
	get total() {
		return this._data.total;
	}

	/**
	 * The last contributor to the hypetrain event.
	 */
	get lastContributor() {
		return this._data.lastContribution;
	}

	/**
	 * Array list of the top contributors to the hypetrain event for bits and subs.
	 */
	get topContributions() {
		return this._data.topContributions;
	}
}
