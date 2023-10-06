import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelPredictionProgressEvent } from '../events/EventSubChannelPredictionProgressEvent';
import { type EventSubChannelPredictionProgressEventData } from '../events/EventSubChannelPredictionProgressEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

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
		return new EventSubChannelPredictionProgressEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelPredictionProgressEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
