import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelPredictionProgressEventData } from '../events/EventSubChannelPredictionProgressEvent.external.js';
import { EventSubChannelPredictionProgressEvent } from '../events/EventSubChannelPredictionProgressEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPredictionProgressSubscription extends EventSubSubscription<EventSubChannelPredictionProgressEvent> {
	/** @protected */ readonly _cliName = 'prediction-progress';

	constructor(
		handler: (data: EventSubChannelPredictionProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.prediction.progress.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelPredictionProgressEventData): EventSubChannelPredictionProgressEvent {
		return this._client._config.managed
			? new EventSubChannelPredictionProgressEvent(data, this._client._config.apiClient)
			: new EventSubChannelPredictionProgressEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelPredictionProgressEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
