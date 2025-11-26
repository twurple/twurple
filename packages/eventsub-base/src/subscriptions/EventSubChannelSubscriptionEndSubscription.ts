import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelSubscriptionEndEvent } from '../events/EventSubChannelSubscriptionEndEvent.js';
import { type EventSubChannelSubscriptionEndEventData } from '../events/EventSubChannelSubscriptionEndEvent.external.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSubscriptionEndSubscription extends EventSubSubscription<EventSubChannelSubscriptionEndEvent> {
	/** @protected */ readonly _cliName = 'unsubscribe';

	constructor(
		handler: (data: EventSubChannelSubscriptionEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.subscription.end.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelSubscriptionEndEventData): EventSubChannelSubscriptionEndEvent {
		return new EventSubChannelSubscriptionEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelSubscriptionEndEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
