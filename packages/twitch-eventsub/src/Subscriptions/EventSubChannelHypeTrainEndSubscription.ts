import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelHypeTrainEndEventData } from '../Events/EventSubChannelHypeTrainEndEvent';
import { EventSubChannelHypeTrainEndEvent } from '../Events/EventSubChannelHypeTrainEndEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelHypeTrainEndSubscription extends EventSubSubscription<EventSubChannelHypeTrainEndEvent> {
	constructor(
		handler: (data: EventSubChannelHypeTrainEndEvent) => void,
		client: EventSubListener,
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
		return this._client._apiClient.helix.eventSub.subscribeToChannelHypeTrainEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
