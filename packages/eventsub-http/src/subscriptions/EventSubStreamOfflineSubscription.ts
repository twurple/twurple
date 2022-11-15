import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubStreamOfflineEventData } from '../events/EventSubStreamOfflineEvent';
import { EventSubStreamOfflineEvent } from '../events/EventSubStreamOfflineEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubStreamOfflineSubscription extends EventSubSubscription<EventSubStreamOfflineEvent> {
	protected readonly _cliName = 'streamdown';

	constructor(
		handler: (data: EventSubStreamOfflineEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `stream.offline.${this._userId}`;
	}

	protected transformData(data: EventSubStreamOfflineEventData): EventSubStreamOfflineEvent {
		return new EventSubStreamOfflineEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToStreamOfflineEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
