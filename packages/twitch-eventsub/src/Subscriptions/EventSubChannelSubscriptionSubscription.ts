import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelSubscriptionEventData } from '../Events/EventSubChannelSubscriptionEvent';
import { EventSubChannelSubscriptionEvent } from '../Events/EventSubChannelSubscriptionEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelSubscriptionSubscription extends EventSubSubscription<EventSubChannelSubscriptionEvent> {
	constructor(
		handler: (data: EventSubChannelSubscriptionEvent) => void,
		client: EventSubListener,
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
		return this._client._apiClient.helix.eventSub.subscribeToChannelSubscriptionEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
