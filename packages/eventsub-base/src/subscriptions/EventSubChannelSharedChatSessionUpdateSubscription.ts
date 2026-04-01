import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelSharedChatSessionUpdateEventData } from '../events/EventSubChannelSharedChatSessionUpdateEvent.external.js';
import { EventSubChannelSharedChatSessionUpdateEvent } from '../events/EventSubChannelSharedChatSessionUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSharedChatSessionUpdateSubscription extends EventSubSubscription<EventSubChannelSharedChatSessionUpdateEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelSharedChatSessionUpdateEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.shared_chat.update.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelSharedChatSessionUpdateEventData,
	): EventSubChannelSharedChatSessionUpdateEvent {
		return this._client._config.managed
			? new EventSubChannelSharedChatSessionUpdateEvent(data, this._client._config.apiClient)
			: new EventSubChannelSharedChatSessionUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelSharedChatSessionUpdateEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
