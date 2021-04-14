import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelRaidEventData } from '../Events/EventSubChannelRaidEvent';
import { EventSubChannelRaidEvent } from '../Events/EventSubChannelRaidEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelRaidSubscription extends EventSubSubscription<EventSubChannelRaidEvent> {
	constructor(
		handler: (data: EventSubChannelRaidEvent) => void,
		client: EventSubListener,
		private readonly _userId: string,
		private readonly _direction: 'from' | 'to'
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.raid.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRaidEventData): EventSubChannelRaidEvent {
		return new EventSubChannelRaidEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		if (this._direction === 'from') {
			return this._client._apiClient.helix.eventSub.subscribeToChannelRaidEventsFrom(
				this._userId,
				await this._getTransportOptions()
			);
		}

		return this._client._apiClient.helix.eventSub.subscribeToChannelRaidEventsTo(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
