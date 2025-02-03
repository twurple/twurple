import { rtfm } from '@twurple/common';
import type { HelixEventSubSubscription } from '@twurple/api';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { type EventSubChannelSharedChatSessionEndEventData } from '../events/EventSubChannelSharedChatSessionEndEvent.external';
import { EventSubChannelSharedChatSessionEndEvent } from '../events/EventSubChannelSharedChatSessionEndEvent';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelSharedChatSessionEndSubscription extends EventSubSubscription<EventSubChannelSharedChatSessionEndEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelSharedChatSessionEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.shared_chat.end.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelSharedChatSessionEndEventData,
	): EventSubChannelSharedChatSessionEndEvent {
		return new EventSubChannelSharedChatSessionEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelSharedChatSessionEndEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
