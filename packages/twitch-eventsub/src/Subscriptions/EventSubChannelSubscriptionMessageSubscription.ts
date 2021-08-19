import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelSubscriptionMessageEventData } from '../Events/EventSubChannelSubscriptionMessageEvent';
import { EventSubChannelSubscriptionMessageEvent } from '../Events/EventSubChannelSubscriptionMessageEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelSubscriptionMessageSubscription extends EventSubSubscription<EventSubChannelSubscriptionMessageEvent> {
	constructor(
		handler: (data: EventSubChannelSubscriptionMessageEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.subscription.message.${this._userId}`;
	}

	protected transformData(
		data: EventSubChannelSubscriptionMessageEventData
	): EventSubChannelSubscriptionMessageEvent {
		return new EventSubChannelSubscriptionMessageEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelSubscriptionMessageEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
