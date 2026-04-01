import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelChatClearEventData } from '../events/EventSubChannelChatClearEvent.external.js';
import { EventSubChannelChatClearEvent } from '../events/EventSubChannelChatClearEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatClearSubscription extends EventSubSubscription<EventSubChannelChatClearEvent> {
	/** @protected */ readonly _cliName = 'chat-clear';

	constructor(
		handler: (data: EventSubChannelChatClearEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.clear.${this._broadcasterId}.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelChatClearEventData): EventSubChannelChatClearEvent {
		return this._client._config.managed
			? new EventSubChannelChatClearEvent(data, this._client._config.apiClient)
			: new EventSubChannelChatClearEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._userId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelChatClearEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
