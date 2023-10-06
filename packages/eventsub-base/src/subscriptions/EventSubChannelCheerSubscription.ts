import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelCheerEvent } from '../events/EventSubChannelCheerEvent';
import { type EventSubChannelCheerEventData } from '../events/EventSubChannelCheerEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCheerSubscription extends EventSubSubscription<EventSubChannelCheerEvent> {
	/** @protected */ readonly _cliName = 'cheer';

	constructor(
		handler: (data: EventSubChannelCheerEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.cheer.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelCheerEventData): EventSubChannelCheerEvent {
		return new EventSubChannelCheerEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelCheerEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
