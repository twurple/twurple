import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelPredictionEndEventData } from '../Events/EventSubChannelPredictionEndEvent';
import { EventSubChannelPredictionEndEvent } from '../Events/EventSubChannelPredictionEndEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelPredictionEndSubscription extends EventSubSubscription<EventSubChannelPredictionEndEvent> {
	constructor(
		handler: (data: EventSubChannelPredictionEndEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.prediction.end.${this._userId}`;
	}

	protected transformData(data: EventSubChannelPredictionEndEventData): EventSubChannelPredictionEndEvent {
		return new EventSubChannelPredictionEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelPredictionEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
