import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelSubscriptionGiftEventData } from '../Events/EventSubChannelSubscriptionGiftEvent';
import { EventSubChannelSubscriptionGiftEvent } from '../Events/EventSubChannelSubscriptionGiftEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelSubscriptionGiftSubscription extends EventSubSubscription<EventSubChannelSubscriptionGiftEvent> {
	constructor(
		handler: (data: EventSubChannelSubscriptionGiftEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.subscription.gift.${this._userId}`;
	}

	protected transformData(data: EventSubChannelSubscriptionGiftEventData): EventSubChannelSubscriptionGiftEvent {
		return new EventSubChannelSubscriptionGiftEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelSubscriptionGiftEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
