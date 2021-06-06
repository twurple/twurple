import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelPredictionLockEventData } from '../Events/EventSubChannelPredictionLockEvent';
import { EventSubChannelPredictionLockEvent } from '../Events/EventSubChannelPredictionLockEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelPredictionLockSubscription extends EventSubSubscription<EventSubChannelPredictionLockEvent> {
	constructor(
		handler: (data: EventSubChannelPredictionLockEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.prediction.lock.${this._userId}`;
	}

	protected transformData(data: EventSubChannelPredictionLockEventData): EventSubChannelPredictionLockEvent {
		return new EventSubChannelPredictionLockEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelPredictionLockEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
