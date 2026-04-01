import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelPredictionEndEventData } from '../events/EventSubChannelPredictionEndEvent.external.js';
import { EventSubChannelPredictionEndEvent } from '../events/EventSubChannelPredictionEndEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPredictionEndSubscription extends EventSubSubscription<EventSubChannelPredictionEndEvent> {
	/** @protected */ readonly _cliName = 'prediction-end';

	constructor(
		handler: (data: EventSubChannelPredictionEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
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
		return this._client._config.managed
			? new EventSubChannelPredictionEndEvent(data, this._client._config.apiClient)
			: new EventSubChannelPredictionEndEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelPredictionEndEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
