import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelSubscriptionEndEventData } from '../Events/EventSubChannelSubscriptionEndEvent';
import { EventSubChannelSubscriptionEndEvent } from '../Events/EventSubChannelSubscriptionEndEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelSubscriptionEndSubscription extends EventSubSubscription<EventSubChannelSubscriptionEndEvent> {
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
		return this._client._apiClient.helix.eventSub.subscribeToChannelSubscriptionEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
