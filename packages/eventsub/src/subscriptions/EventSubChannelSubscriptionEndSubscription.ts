import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelSubscriptionEndEventData } from '../events/EventSubChannelSubscriptionEndEvent';
import { EventSubChannelSubscriptionEndEvent } from '../events/EventSubChannelSubscriptionEndEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelSubscriptionEndSubscription extends EventSubSubscription<EventSubChannelSubscriptionEndEvent> {
	protected readonly _cliName = 'unsubscribe';

	constructor(
		handler: (data: EventSubChannelSubscriptionEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.subscription.end.${this._userId}`;
	}

	protected transformData(data: EventSubChannelSubscriptionEndEventData): EventSubChannelSubscriptionEndEvent {
		return new EventSubChannelSubscriptionEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelSubscriptionEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
