import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, HellFreezesOverError, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelPredictionOutcome } from './common/EventSubChannelPredictionOutcome';
import {
	type EventSubChannelPredictionEndEventData,
	type EventSubChannelPredictionEndStatus
} from './EventSubChannelPredictionEndEvent.external';

/**
 * An EventSub event representing a prediction being locked in a channel.
 */
@rtfm<EventSubChannelPredictionEndEvent>('eventsub-base', 'EventSubChannelPredictionEndEvent', 'broadcasterId')
export class EventSubChannelPredictionEndEvent extends DataObject<EventSubChannelPredictionEndEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelPredictionEndEventData, client: ApiClient) {
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
	 * The title of the prediction.
	 */
	get title(): string {
		return this[rawDataSymbol].title;
	}

	/**
	 * The possible outcomes of the prediction.
	 */
	get outcomes(): EventSubChannelPredictionOutcome[] {
		return this[rawDataSymbol].outcomes.map(data => new EventSubChannelPredictionOutcome(data, this._client));
	}

	/**
	 * The time when the prediction started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * The time when the prediction ended.
	 */
	get endDate(): Date {
		return new Date(this[rawDataSymbol].ended_at);
	}

	/**
	 * The status of the prediction.
	 */
	get status(): EventSubChannelPredictionEndStatus {
		return this[rawDataSymbol].status;
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
	get winningOutcome(): EventSubChannelPredictionOutcome | null {
		if (this[rawDataSymbol].winning_outcome_id === null) {
			return null;
		}

		const found = this[rawDataSymbol].outcomes.find(o => o.id === this[rawDataSymbol].winning_outcome_id);
		if (!found) {
			throw new HellFreezesOverError('Winning outcome not found in outcomes array');
		}
		return new EventSubChannelPredictionOutcome(found, this._client);
	}
}
