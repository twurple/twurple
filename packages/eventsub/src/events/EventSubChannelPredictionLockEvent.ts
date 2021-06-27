import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelPredictionOutcomeData } from './common/EventSubChannelPredictionOutcome';
import { EventSubChannelPredictionOutcome } from './common/EventSubChannelPredictionOutcome';

/** @private */
export interface EventSubChannelPredictionLockEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	title: string;
	outcomes: EventSubChannelPredictionOutcomeData[];
	started_at: string;
	locked_at: string;
}

/**
 * An EventSub event representing a prediction being locked in a channel.
 */
@rtfm<EventSubChannelPredictionLockEvent>('eventsub', 'EventSubChannelPredictionLockEvent', 'broadcasterId')
export class EventSubChannelPredictionLockEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelPredictionLockEventData, client: ApiClient) {
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
	 * The possible of the prediction.
	 */
	get outcomes(): EventSubChannelPredictionOutcome[] {
		return this._data.outcomes.map(data => new EventSubChannelPredictionOutcome(data, this._client));
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
}
