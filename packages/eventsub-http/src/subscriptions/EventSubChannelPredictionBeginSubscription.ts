import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelPredictionBeginEventData } from '../events/EventSubChannelPredictionBeginEvent';
import { EventSubChannelPredictionBeginEvent } from '../events/EventSubChannelPredictionBeginEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelPredictionBeginSubscription extends EventSubSubscription<EventSubChannelPredictionBeginEvent> {
	protected readonly _cliName = 'prediction-begin';

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
		return await this._client._apiClient.eventSub.subscribeToChannelPredictionBeginEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
