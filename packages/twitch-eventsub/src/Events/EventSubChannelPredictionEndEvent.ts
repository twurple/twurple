import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelPredictionOutcomeData } from './Common/EventSubChannelPredictionOutcome';

/** @private */
export type EventSubChannelPredictionEndStatus = 'resolved' | 'canceled';

/** @private */
export interface EventSubChannelPredictionEndEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	title: string;
	winning_outcome_id: string | null;
	outcomes: EventSubChannelPredictionOutcomeData[];
	status: EventSubChannelPredictionEndStatus;
	started_at: string;
	locked_at: string;
}

/**
 * An EventSub event representing a prediction being locked in a channel.
 */
@rtfm<EventSubChannelPredictionEndEvent>('twitch-eventsub', 'EventSubChannelPredictionEndEvent', 'broadcasterId')
export class EventSubChannelPredictionEndEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelPredictionEndEventData, client: ApiClient) {
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
		return this._data.broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_user_login;
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
	 * The title of the prediction.
	 */
	get title(): string {
		return this._data.title;
	}

	/**
	 * The possible outcomes of the prediction.
	 */
	get outcomes(): EventSubChannelPredictionOutcomeData[] {
		return this._data.outcomes;
	}

	/**
	 * The time when the prediction started.
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}

	/**
	 * The time when the prediction was locked.
	 */
	get lockDate(): Date {
		return new Date(this._data.locked_at);
	}

	/**
	 * The status of the prediction.
	 */
	get status(): EventSubChannelPredictionEndStatus {
		return this._data.status;
	}

	/**
	 * The ID of the winning outcome, or null if the prediction was canceled.
	 */
	get winningOutcomeId(): string | null {
		return this._data.winning_outcome_id;
	}

	/**
	 * The winning outcome, or null if the prediction was canceled.
	 */
	get winningOutcome(): EventSubChannelPredictionOutcomeData | null {
		if (this._data.winning_outcome_id === null) {
			return null;
		}

		return this._data.outcomes.find(o => o.id === this._data.winning_outcome_id) ?? null;
	}
}
