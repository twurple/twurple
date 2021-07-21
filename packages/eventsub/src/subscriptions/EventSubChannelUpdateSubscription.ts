import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelUpdateEventData } from '../events/EventSubChannelUpdateEvent';
import { EventSubChannelUpdateEvent } from '../events/EventSubChannelUpdateEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelUpdateSubscription extends EventSubSubscription<EventSubChannelUpdateEvent> {
	constructor(
		handler: (data: EventSubChannelUpdateEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.update.${this._userId}`;
	}

	protected transformData(data: EventSubChannelUpdateEventData): EventSubChannelUpdateEvent {
		return new EventSubChannelUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelUpdateEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
