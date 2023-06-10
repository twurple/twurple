import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelSubscriptionMessageEvent } from '../events/EventSubChannelSubscriptionMessageEvent';
import { type EventSubChannelSubscriptionMessageEventData } from '../events/EventSubChannelSubscriptionMessageEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSubscriptionMessageSubscription extends EventSubSubscription<EventSubChannelSubscriptionMessageEvent> {
	/** @protected */ readonly _cliName = 'subscribe-message';

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

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelSubscriptionMessageEventData
	): EventSubChannelSubscriptionMessageEvent {
		return new EventSubChannelSubscriptionMessageEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelSubscriptionMessageEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
