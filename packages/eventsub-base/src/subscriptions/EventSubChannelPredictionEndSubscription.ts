import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelPredictionEndEvent } from '../events/EventSubChannelPredictionEndEvent';
import { type EventSubChannelPredictionEndEventData } from '../events/EventSubChannelPredictionEndEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPredictionEndSubscription extends EventSubSubscription<EventSubChannelPredictionEndEvent> {
	/** @protected */ readonly _cliName = 'prediction-end';

	constructor(
		handler: (data: EventSubChannelPredictionEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.prediction.end.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelPredictionEndEventData): EventSubChannelPredictionEndEvent {
		return new EventSubChannelPredictionEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelPredictionEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
