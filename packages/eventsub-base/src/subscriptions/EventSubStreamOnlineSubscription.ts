import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubStreamOnlineEvent } from '../events/EventSubStreamOnlineEvent.js';
import { type EventSubStreamOnlineEventData } from '../events/EventSubStreamOnlineEvent.external.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubStreamOnlineSubscription extends EventSubSubscription<EventSubStreamOnlineEvent> {
	/** @protected */ readonly _cliName = 'streamup';

	constructor(
		handler: (data: EventSubStreamOnlineEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `stream.online.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubStreamOnlineEventData): EventSubStreamOnlineEvent {
		return new EventSubStreamOnlineEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToStreamOnlineEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
