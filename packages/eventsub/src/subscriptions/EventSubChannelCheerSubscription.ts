import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelCheerEventData } from '../events/EventSubChannelCheerEvent';
import { EventSubChannelCheerEvent } from '../events/EventSubChannelCheerEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelCheerSubscription extends EventSubSubscription<EventSubChannelCheerEvent> {
	constructor(
		handler: (data: EventSubChannelCheerEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.cheer.${this._userId}`;
	}

	protected transformData(data: EventSubChannelCheerEventData): EventSubChannelCheerEvent {
		return new EventSubChannelCheerEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.helix.eventSub.subscribeToChannelCheerEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
