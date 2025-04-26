import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubChannelBitsUseEvent } from '../events/EventSubChannelBitsUseEvent';
import { type EventSubChannelBitsUseEventData } from '../events/EventSubChannelBitsUseEvent.external';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelBitsUseSubscription extends EventSubSubscription<EventSubChannelBitsUseEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelBitsUseEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.bits.use.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelBitsUseEventData): EventSubChannelBitsUseEvent {
		return new EventSubChannelBitsUseEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelBitsUseEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
