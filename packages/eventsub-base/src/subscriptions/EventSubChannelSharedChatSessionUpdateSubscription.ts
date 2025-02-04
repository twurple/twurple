import { rtfm } from '@twurple/common';
import type { HelixEventSubSubscription } from '@twurple/api';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { type EventSubChannelSharedChatSessionUpdateEventData } from '../events/EventSubChannelSharedChatSessionUpdateEvent.external';
import { EventSubChannelSharedChatSessionUpdateEvent } from '../events/EventSubChannelSharedChatSessionUpdateEvent';

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
		return new EventSubChannelSharedChatSessionUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelSharedChatSessionUpdateEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
