import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelSharedChatSessionBeginEventData } from '../events/EventSubChannelSharedChatSessionBeginEvent.external.js';
import { EventSubChannelSharedChatSessionBeginEvent } from '../events/EventSubChannelSharedChatSessionBeginEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSharedChatSessionBeginSubscription extends EventSubSubscription<EventSubChannelSharedChatSessionBeginEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelSharedChatSessionBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.shared_chat.begin.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelSharedChatSessionBeginEventData,
	): EventSubChannelSharedChatSessionBeginEvent {
		return this._client._config.managed
			? new EventSubChannelSharedChatSessionBeginEvent(data, this._client._config.apiClient)
			: new EventSubChannelSharedChatSessionBeginEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelSharedChatSessionBeginEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
