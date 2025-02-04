import { rtfm } from '@twurple/common';
import type { HelixEventSubSubscription } from '@twurple/api';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { type EventSubChannelSharedChatSessionBeginEventData } from '../events/EventSubChannelSharedChatSessionBeginEvent.external';
import { EventSubChannelSharedChatSessionBeginEvent } from '../events/EventSubChannelSharedChatSessionBeginEvent';

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
		return new EventSubChannelSharedChatSessionBeginEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelSharedChatSessionBeginEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
