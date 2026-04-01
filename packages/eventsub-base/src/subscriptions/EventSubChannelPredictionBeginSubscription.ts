import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelPredictionBeginEventData } from '../events/EventSubChannelPredictionBeginEvent.external.js';
import { EventSubChannelPredictionBeginEvent } from '../events/EventSubChannelPredictionBeginEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPredictionBeginSubscription extends EventSubSubscription<EventSubChannelPredictionBeginEvent> {
	/** @protected */ readonly _cliName = 'prediction-begin';

	constructor(
		handler: (data: EventSubChannelPredictionBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.prediction.begin.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelPredictionBeginEventData): EventSubChannelPredictionBeginEvent {
		return this._client._config.managed
			? new EventSubChannelPredictionBeginEvent(data, this._client._config.apiClient)
			: new EventSubChannelPredictionBeginEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelPredictionBeginEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
