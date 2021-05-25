import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelHypeTrainProgressEventData } from '../events/EventSubChannelHypeTrainProgressEvent';
import { EventSubChannelHypeTrainProgressEvent } from '../events/EventSubChannelHypeTrainProgressEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelHypeTrainProgressSubscription extends EventSubSubscription<EventSubChannelHypeTrainProgressEvent> {
	constructor(
		handler: (data: EventSubChannelHypeTrainProgressEvent) => void,
		client: EventSubListener,
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
		return await this._client._apiClient.helix.eventSub.subscribeToChannelHypeTrainProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
