import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelSubscriptionGiftEvent } from '../events/EventSubChannelSubscriptionGiftEvent';
import { type EventSubChannelSubscriptionGiftEventData } from '../events/EventSubChannelSubscriptionGiftEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSubscriptionGiftSubscription extends EventSubSubscription<EventSubChannelSubscriptionGiftEvent> {
	/** @protected */ readonly _cliName = 'gift';

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
		return await this._client._apiClient.eventSub.subscribeToChannelSubscriptionGiftEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
