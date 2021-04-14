import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelHypeTrainBeginEventData } from '../Events/EventSubChannelHypeTrainBeginEvent';
import { EventSubChannelHypeTrainBeginEvent } from '../Events/EventSubChannelHypeTrainBeginEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelHypeTrainBeginSubscription extends EventSubSubscription<EventSubChannelHypeTrainBeginEvent> {
	constructor(
		handler: (data: EventSubChannelHypeTrainBeginEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.begin.${this._userId}`;
	}

	protected transformData(data: EventSubChannelHypeTrainBeginEventData): EventSubChannelHypeTrainBeginEvent {
		return new EventSubChannelHypeTrainBeginEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelHypeTrainBeginEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
