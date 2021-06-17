import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelPredictionBeginEventData } from '../Events/EventSubChannelPredictionBeginEvent';
import { EventSubChannelPredictionBeginEvent } from '../Events/EventSubChannelPredictionBeginEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelPredictionBeginSubscription extends EventSubSubscription<EventSubChannelPredictionBeginEvent> {
	constructor(
		handler: (data: EventSubChannelPredictionBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.prediction.begin.${this._userId}`;
	}

	protected transformData(data: EventSubChannelPredictionBeginEventData): EventSubChannelPredictionBeginEvent {
		return new EventSubChannelPredictionBeginEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelPredictionBeginEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
