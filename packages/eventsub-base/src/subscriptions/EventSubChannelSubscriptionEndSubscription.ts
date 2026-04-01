import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelSubscriptionEndEventData } from '../events/EventSubChannelSubscriptionEndEvent.external.js';
import { EventSubChannelSubscriptionEndEvent } from '../events/EventSubChannelSubscriptionEndEvent.js';
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
		return this._client._config.managed
			? new EventSubChannelSubscriptionEndEvent(data, this._client._config.apiClient)
			: new EventSubChannelSubscriptionEndEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelSubscriptionEndEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
