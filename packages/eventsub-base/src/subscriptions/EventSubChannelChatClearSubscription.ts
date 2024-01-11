import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelChatClearEvent } from '../events/EventSubChannelChatClearEvent';
import { type EventSubChannelChatClearEventData } from '../events/EventSubChannelChatClearEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatClearSubscription extends EventSubSubscription<EventSubChannelChatClearEvent> {
	/** @protected */ readonly _cliName = 'chat-clear';

	constructor(
		handler: (data: EventSubChannelChatClearEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.clear.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelChatClearEventData): EventSubChannelChatClearEvent {
		return new EventSubChannelChatClearEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelChatClearEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
