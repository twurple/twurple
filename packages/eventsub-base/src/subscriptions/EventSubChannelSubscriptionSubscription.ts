import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelSubscriptionEvent } from '../events/EventSubChannelSubscriptionEvent';
import { type EventSubChannelSubscriptionEventData } from '../events/EventSubChannelSubscriptionEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSubscriptionSubscription extends EventSubSubscription<EventSubChannelSubscriptionEvent> {
	/** @protected */ readonly _cliName = 'subscribe';

	constructor(
		handler: (data: EventSubChannelSubscriptionEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.subscribe.${this._userId}`;
	}

	protected transformData(data: EventSubChannelSubscriptionEventData): EventSubChannelSubscriptionEvent {
		return new EventSubChannelSubscriptionEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelSubscriptionEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
