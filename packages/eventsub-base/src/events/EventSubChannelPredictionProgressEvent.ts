import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelPredictionOutcome } from './common/EventSubChannelPredictionOutcome';
import { type EventSubChannelPredictionProgressEventData } from './EventSubChannelPredictionProgressEvent.external';

/**
 * An EventSub event representing a prediction being voted on in a channel.
 */
@rtfm<EventSubChannelPredictionProgressEvent>(
	'eventsub-base',
	'EventSubChannelPredictionProgressEvent',
	'broadcasterId',
)
export class EventSubChannelPredictionProgressEvent extends DataObject<EventSubChannelPredictionProgressEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelPredictionProgressEventData, client: ApiClient) {
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
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
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
	 * The time when the prediction is locked.
	 */
	get lockDate(): Date {
		return new Date(this[rawDataSymbol].locks_at);
	}
}
