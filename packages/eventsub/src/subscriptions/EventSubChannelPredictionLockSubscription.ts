import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelPredictionLockEventData } from '../events/EventSubChannelPredictionLockEvent';
import { EventSubChannelPredictionLockEvent } from '../events/EventSubChannelPredictionLockEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelPredictionLockSubscription extends EventSubSubscription<EventSubChannelPredictionLockEvent> {
	constructor(
		handler: (data: EventSubChannelPredictionLockEvent) => void,
		client: EventSubBase,
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
		return await this._client._apiClient.helix.eventSub.subscribeToChannelPredictionLockEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
