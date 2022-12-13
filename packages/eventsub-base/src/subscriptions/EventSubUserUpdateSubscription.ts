import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubUserUpdateEvent } from '../events/EventSubUserUpdateEvent';
import { type EventSubUserUpdateEventData } from '../events/EventSubUserUpdateEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubUserUpdateSubscription extends EventSubSubscription<EventSubUserUpdateEvent> {
	/** @protected */ readonly _cliName = 'user.update';

	constructor(
		handler: (data: EventSubUserUpdateEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.update.${this._userId}`;
	}

	protected transformData(data: EventSubUserUpdateEventData): EventSubUserUpdateEvent {
		return new EventSubUserUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToUserUpdateEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
