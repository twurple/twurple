import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubStreamOfflineEventData } from '../events/EventSubStreamOfflineEvent.external.js';
import { EventSubStreamOfflineEvent } from '../events/EventSubStreamOfflineEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubStreamOfflineSubscription extends EventSubSubscription<EventSubStreamOfflineEvent> {
	/** @protected */ readonly _cliName = 'streamdown';

	constructor(
		handler: (data: EventSubStreamOfflineEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `stream.offline.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubStreamOfflineEventData): EventSubStreamOfflineEvent {
		return this._client._config.managed
			? new EventSubStreamOfflineEvent(data, this._client._config.apiClient)
			: new EventSubStreamOfflineEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToStreamOfflineEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
