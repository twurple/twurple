import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelCheerEventData } from '../events/EventSubChannelCheerEvent.external.js';
import { EventSubChannelCheerEvent } from '../events/EventSubChannelCheerEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCheerSubscription extends EventSubSubscription<EventSubChannelCheerEvent> {
	/** @protected */ readonly _cliName = 'cheer';

	constructor(
		handler: (data: EventSubChannelCheerEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.cheer.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelCheerEventData): EventSubChannelCheerEvent {
		return this._client._config.managed
			? new EventSubChannelCheerEvent(data, this._client._config.apiClient)
			: new EventSubChannelCheerEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelCheerEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
