import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelBitsUseEventData } from '../events/EventSubChannelBitsUseEvent.external.js';
import { EventSubChannelBitsUseEvent } from '../events/EventSubChannelBitsUseEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelBitsUseSubscription extends EventSubSubscription<EventSubChannelBitsUseEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelBitsUseEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.bits.use.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelBitsUseEventData): EventSubChannelBitsUseEvent {
		return this._client._config.managed
			? new EventSubChannelBitsUseEvent(data, this._client._config.apiClient)
			: new EventSubChannelBitsUseEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelBitsUseEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
