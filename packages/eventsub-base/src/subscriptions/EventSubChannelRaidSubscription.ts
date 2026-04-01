import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelRaidEventData } from '../events/EventSubChannelRaidEvent.external.js';
import { EventSubChannelRaidEvent } from '../events/EventSubChannelRaidEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelRaidSubscription extends EventSubSubscription<EventSubChannelRaidEvent> {
	/** @protected */ readonly _cliName = 'raid';

	constructor(
		handler: (data: EventSubChannelRaidEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _direction: 'from' | 'to',
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.raid.${this._direction}.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelRaidEventData): EventSubChannelRaidEvent {
		return this._client._config.managed
			? new EventSubChannelRaidEvent(data, this._client._config.apiClient)
			: new EventSubChannelRaidEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		if (this._direction === 'from') {
			return this._client._config.managed
				? await this._client._config.apiClient.eventSub.subscribeToChannelRaidEventsFrom(
						this._userId,
						await this._getTransportOptions(),
				  )
				: undefined;
		}

		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelRaidEventsTo(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
