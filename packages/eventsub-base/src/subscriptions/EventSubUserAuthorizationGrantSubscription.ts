import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubUserAuthorizationGrantEventData } from '../events/EventSubUserAuthorizationGrantEvent.external.js';
import { EventSubUserAuthorizationGrantEvent } from '../events/EventSubUserAuthorizationGrantEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubUserAuthorizationGrantSubscription extends EventSubSubscription<EventSubUserAuthorizationGrantEvent> {
	/** @protected */ readonly _cliName = 'grant';
	readonly authUserId = null;

	constructor(
		handler: (data: EventSubUserAuthorizationGrantEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.authorization.grant.${this._userId}`;
	}

	protected transformData(data: EventSubUserAuthorizationGrantEventData): EventSubUserAuthorizationGrantEvent {
		return this._client._config.managed
			? new EventSubUserAuthorizationGrantEvent(data, this._client._config.apiClient)
			: new EventSubUserAuthorizationGrantEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToUserAuthorizationGrantEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
