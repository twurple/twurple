import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelHypeTrainProgressEvent } from '../events/EventSubChannelHypeTrainProgressEvent';
import { type EventSubChannelHypeTrainProgressEventData } from '../events/EventSubChannelHypeTrainProgressEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelHypeTrainProgressSubscription extends EventSubSubscription<EventSubChannelHypeTrainProgressEvent> {
	/** @protected */ readonly _cliName = 'hype-train-progress';

	constructor(
		handler: (data: EventSubChannelHypeTrainProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.progress.${this._userId}`;
	}

	protected transformData(data: EventSubChannelHypeTrainProgressEventData): EventSubChannelHypeTrainProgressEvent {
		return new EventSubChannelHypeTrainProgressEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelHypeTrainProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
