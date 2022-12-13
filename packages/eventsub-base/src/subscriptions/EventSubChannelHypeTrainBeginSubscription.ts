import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelHypeTrainBeginEvent } from '../events/EventSubChannelHypeTrainBeginEvent';
import { type EventSubChannelHypeTrainBeginEventData } from '../events/EventSubChannelHypeTrainBeginEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelHypeTrainBeginSubscription extends EventSubSubscription<EventSubChannelHypeTrainBeginEvent> {
	/** @protected */ readonly _cliName = 'hype-train-begin';

	constructor(
		handler: (data: EventSubChannelHypeTrainBeginEvent) => void,
		client: EventSubBase,
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
		return await this._client._apiClient.eventSub.subscribeToChannelHypeTrainBeginEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
