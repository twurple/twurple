import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubUserAuthorizationGrantEventData } from '../events/EventSubUserAuthorizationGrantEvent';
import { EventSubUserAuthorizationGrantEvent } from '../events/EventSubUserAuthorizationGrantEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubUserAuthorizationGrantSubscription extends EventSubSubscription<EventSubUserAuthorizationGrantEvent> {
	/** @protected */ readonly _cliName = 'grant';

	constructor(
		handler: (data: EventSubUserAuthorizationGrantEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.authorization.grant.${this._userId}`;
	}

	protected transformData(data: EventSubUserAuthorizationGrantEventData): EventSubUserAuthorizationGrantEvent {
		return new EventSubUserAuthorizationGrantEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToUserAuthorizationGrantEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
