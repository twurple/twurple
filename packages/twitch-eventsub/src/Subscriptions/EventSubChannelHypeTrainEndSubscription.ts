import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelHypeTrainEndEventData } from '../Events/EventSubChannelHypeTrainEndEvent';
import { EventSubChannelHypeTrainEndEvent } from '../Events/EventSubChannelHypeTrainEndEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelHypeTrainEndSubscription extends EventSubSubscription<EventSubChannelHypeTrainEndEvent> {
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
		return this._client._apiClient.helix.eventSub.subscribeToChannelHypeTrainEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
