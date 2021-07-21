import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubUserAuthorizationRevokeEventData } from '../events/EventSubUserAuthorizationRevokeEvent';
import { EventSubUserAuthorizationRevokeEvent } from '../events/EventSubUserAuthorizationRevokeEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubUserAuthorizationRevokeSubscription extends EventSubSubscription<EventSubUserAuthorizationRevokeEvent> {
	constructor(
		handler: (data: EventSubUserAuthorizationRevokeEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.authorization.revoke.${this._userId}`;
	}

	protected transformData(data: EventSubUserAuthorizationRevokeEventData): EventSubUserAuthorizationRevokeEvent {
		return new EventSubUserAuthorizationRevokeEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToUserAuthorizationRevokeEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
