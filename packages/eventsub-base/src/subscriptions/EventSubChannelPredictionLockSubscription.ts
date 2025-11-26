import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelPredictionLockEvent } from '../events/EventSubChannelPredictionLockEvent.js';
import { type EventSubChannelPredictionLockEventData } from '../events/EventSubChannelPredictionLockEvent.external.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPredictionLockSubscription extends EventSubSubscription<EventSubChannelPredictionLockEvent> {
	/** @protected */ readonly _cliName = 'prediction-lock';

	constructor(
		handler: (data: EventSubChannelPredictionLockEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.prediction.lock.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelPredictionLockEventData): EventSubChannelPredictionLockEvent {
		return new EventSubChannelPredictionLockEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelPredictionLockEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
