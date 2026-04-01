import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubUserAuthorizationRevokeEventData } from '../events/EventSubUserAuthorizationRevokeEvent.external.js';
import { EventSubUserAuthorizationRevokeEvent } from '../events/EventSubUserAuthorizationRevokeEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubUserAuthorizationRevokeSubscription extends EventSubSubscription<EventSubUserAuthorizationRevokeEvent> {
	/** @protected */ readonly _cliName = 'revoke';
	readonly authUserId = null;

	constructor(
		handler: (data: EventSubUserAuthorizationRevokeEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.authorization.revoke.${this._userId}`;
	}

	protected transformData(data: EventSubUserAuthorizationRevokeEventData): EventSubUserAuthorizationRevokeEvent {
		return this._client._config.managed
			? new EventSubUserAuthorizationRevokeEvent(data, this._client._config.apiClient)
			: new EventSubUserAuthorizationRevokeEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToUserAuthorizationRevokeEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
