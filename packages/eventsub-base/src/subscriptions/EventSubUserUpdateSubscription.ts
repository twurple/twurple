import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubUserUpdateEventData } from '../events/EventSubUserUpdateEvent.external.js';
import { EventSubUserUpdateEvent } from '../events/EventSubUserUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubUserUpdateSubscription extends EventSubSubscription<EventSubUserUpdateEvent> {
	/** @protected */ readonly _cliName = 'user.update';

	constructor(
		handler: (data: EventSubUserUpdateEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.update.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubUserUpdateEventData): EventSubUserUpdateEvent {
		return this._client._config.managed
			? new EventSubUserUpdateEvent(data, this._client._config.apiClient)
			: new EventSubUserUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToUserUpdateEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
