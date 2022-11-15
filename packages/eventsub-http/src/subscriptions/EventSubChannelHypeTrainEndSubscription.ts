import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelHypeTrainEndEventData } from '../events/EventSubChannelHypeTrainEndEvent';
import { EventSubChannelHypeTrainEndEvent } from '../events/EventSubChannelHypeTrainEndEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelHypeTrainEndSubscription extends EventSubSubscription<EventSubChannelHypeTrainEndEvent> {
	protected readonly _cliName = 'hype-train-end';

	constructor(
		handler: (data: EventSubChannelHypeTrainEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.end.${this._userId}`;
	}

	protected transformData(data: EventSubChannelHypeTrainEndEventData): EventSubChannelHypeTrainEndEvent {
		return new EventSubChannelHypeTrainEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelHypeTrainEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
