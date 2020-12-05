import type { HelixEventSubSubscription } from 'twitch';
import type { EventSubChannelUpdateEventData } from '../Events/EventSubChannelUpdateEvent';
import { EventSubChannelUpdateEvent } from '../Events/EventSubChannelUpdateEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
export class EventSubChannelUpdateSubscription extends EventSubSubscription<EventSubChannelUpdateEvent> {
	constructor(
		handler: (data: EventSubChannelUpdateEvent) => void,
		client: EventSubListener,
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
		return this._client._apiClient.helix.eventSub.subcribeToChannelUpdateEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
