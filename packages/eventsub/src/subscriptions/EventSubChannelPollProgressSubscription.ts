import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelPollProgressEventData } from '../events/EventSubChannelPollProgressEvent';
import { EventSubChannelPollProgressEvent } from '../events/EventSubChannelPollProgressEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelPollProgressSubscription extends EventSubSubscription<EventSubChannelPollProgressEvent> {
	constructor(
		handler: (data: EventSubChannelPollProgressEvent) => void,
		client: EventSubBase,
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
		return await this._client._apiClient.helix.eventSub.subscribeToChannelPollProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
