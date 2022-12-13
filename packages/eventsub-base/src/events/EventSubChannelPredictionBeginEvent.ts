import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelPredictionBeginOutcome } from './common/EventSubChannelPredictionBeginOutcome';
import { type EventSubChannelPredictionBeginEventData } from './EventSubChannelPredictionBeginEvent.external';

/**
 * An EventSub event representing a prediction starting in a channel.
 */
@rtfm<EventSubChannelPredictionBeginEvent>('eventsub-base', 'EventSubChannelPredictionBeginEvent', 'broadcasterId')
export class EventSubChannelPredictionBeginEvent extends DataObject<EventSubChannelPredictionBeginEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelPredictionBeginEventData, client: ApiClient) {
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
	get outcomes(): EventSubChannelPredictionBeginOutcome[] {
		return this[rawDataSymbol].outcomes.map(data => new EventSubChannelPredictionBeginOutcome(data));
	}

	/**
	 * The time when the prediction started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}

	/**
	 * The time when the prediction is locked.
	 */
	get lockDate(): Date {
		return new Date(this[rawDataSymbol].locks_at);
	}
}
