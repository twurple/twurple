import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubStreamOnlineEventData } from '../Events/EventSubStreamOnlineEvent';
import { EventSubStreamOnlineEvent } from '../Events/EventSubStreamOnlineEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubStreamOnlineSubscription extends EventSubSubscription<EventSubStreamOnlineEvent> {
	constructor(
		handler: (data: EventSubStreamOnlineEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `stream.online.${this._userId}`;
	}

	protected transformData(data: EventSubStreamOnlineEventData): EventSubStreamOnlineEvent {
		return new EventSubStreamOnlineEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToStreamOnlineEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
