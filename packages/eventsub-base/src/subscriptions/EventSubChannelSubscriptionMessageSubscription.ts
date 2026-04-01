import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelSubscriptionMessageEventData } from '../events/EventSubChannelSubscriptionMessageEvent.external.js';
import { EventSubChannelSubscriptionMessageEvent } from '../events/EventSubChannelSubscriptionMessageEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSubscriptionMessageSubscription extends EventSubSubscription<EventSubChannelSubscriptionMessageEvent> {
	/** @protected */ readonly _cliName = 'subscribe-message';

	constructor(
		handler: (data: EventSubChannelSubscriptionMessageEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
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
		data: EventSubChannelSubscriptionMessageEventData,
	): EventSubChannelSubscriptionMessageEvent {
		return this._client._config.managed
			? new EventSubChannelSubscriptionMessageEvent(data, this._client._config.apiClient)
			: new EventSubChannelSubscriptionMessageEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelSubscriptionMessageEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
