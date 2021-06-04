import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';
import type { EventSubChannelPollProgressEventData } from '../Events/EventSubChannelPollProgressEvent';
import { EventSubChannelPollProgressEvent } from '../Events/EventSubChannelPollProgressEvent';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelPollProgressSubscription extends EventSubSubscription<EventSubChannelPollProgressEvent> {
	constructor(
		handler: (data: EventSubChannelPollProgressEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.poll.progress.${this._userId}`;
	}

	protected transformData(data: EventSubChannelPollProgressEventData): EventSubChannelPollProgressEvent {
		return new EventSubChannelPollProgressEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelPollProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
