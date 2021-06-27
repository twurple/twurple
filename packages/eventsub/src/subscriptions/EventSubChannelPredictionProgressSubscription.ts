import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelPredictionProgressEventData } from '../Events/EventSubChannelPredictionProgressEvent';
import { EventSubChannelPredictionProgressEvent } from '../Events/EventSubChannelPredictionProgressEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelPredictionProgressSubscription extends EventSubSubscription<EventSubChannelPredictionProgressEvent> {
	constructor(
		handler: (data: EventSubChannelPredictionProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.prediction.progress.${this._userId}`;
	}

	protected transformData(data: EventSubChannelPredictionProgressEventData): EventSubChannelPredictionProgressEvent {
		return new EventSubChannelPredictionProgressEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelPredictionProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
