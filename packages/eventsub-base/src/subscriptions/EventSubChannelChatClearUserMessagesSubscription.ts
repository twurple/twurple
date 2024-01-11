import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelChatClearUserMessagesEvent } from '../events/EventSubChannelChatClearUserMessagesEvent';
import { type EventSubChannelChatClearUserMessagesEventData } from '../events/EventSubChannelChatClearUserMessagesEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatClearUserMessagesSubscription extends EventSubSubscription<EventSubChannelChatClearUserMessagesEvent> {
	/** @protected */ readonly _cliName = 'chat-clear-user-messages';

	constructor(
		handler: (data: EventSubChannelChatClearUserMessagesEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.clear_user_messages.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelChatClearUserMessagesEventData,
	): EventSubChannelChatClearUserMessagesEvent {
		return new EventSubChannelChatClearUserMessagesEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelChatClearUserMessagesEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
