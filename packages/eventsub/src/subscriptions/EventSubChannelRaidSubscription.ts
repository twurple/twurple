import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelRaidEventData } from '../events/EventSubChannelRaidEvent';
import { EventSubChannelRaidEvent } from '../events/EventSubChannelRaidEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelRaidSubscription extends EventSubSubscription<EventSubChannelRaidEvent> {
	constructor(
		handler: (data: EventSubChannelRaidEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _direction: 'from' | 'to'
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.raid.${this._direction}.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRaidEventData): EventSubChannelRaidEvent {
		return new EventSubChannelRaidEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		if (this._direction === 'from') {
			return await this._client._apiClient.eventSub.subscribeToChannelRaidEventsFrom(
				this._userId,
				await this._getTransportOptions()
			);
		}

		return await this._client._apiClient.eventSub.subscribeToChannelRaidEventsTo(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
