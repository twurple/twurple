import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelUpdateEventData } from '../events/EventSubChannelUpdateEvent.external.js';
import { EventSubChannelUpdateEvent } from '../events/EventSubChannelUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelUpdateSubscription extends EventSubSubscription<EventSubChannelUpdateEvent> {
	/** @protected */ readonly _cliName = 'stream-change';

	constructor(
		handler: (data: EventSubChannelUpdateEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.update.v2.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelUpdateEventData): EventSubChannelUpdateEvent {
		return this._client._config.managed
			? new EventSubChannelUpdateEvent(data, this._client._config.apiClient)
			: new EventSubChannelUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelUpdateEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
