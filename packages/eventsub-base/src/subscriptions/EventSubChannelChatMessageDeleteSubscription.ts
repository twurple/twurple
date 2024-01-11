import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelChatMessageDeleteEvent } from '../events/EventSubChannelChatMessageDeleteEvent';
import { type EventSubChannelChatMessageDeleteEventData } from '../events/EventSubChannelChatMessageDeleteEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatMessageDeleteSubscription extends EventSubSubscription<EventSubChannelChatMessageDeleteEvent> {
	/** @protected */ readonly _cliName = 'chat-message-delete';

	constructor(
		handler: (data: EventSubChannelChatMessageDeleteEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.message_delete.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelChatMessageDeleteEventData): EventSubChannelChatMessageDeleteEvent {
		return new EventSubChannelChatMessageDeleteEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelChatMessageDeleteEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
