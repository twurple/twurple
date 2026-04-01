import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelChatClearUserMessagesEventData } from '../events/EventSubChannelChatClearUserMessagesEvent.external.js';
import { EventSubChannelChatClearUserMessagesEvent } from '../events/EventSubChannelChatClearUserMessagesEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatClearUserMessagesSubscription extends EventSubSubscription<EventSubChannelChatClearUserMessagesEvent> {
	/** @protected */ readonly _cliName = 'chat-clear-user-messages';

	constructor(
		handler: (data: EventSubChannelChatClearUserMessagesEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.clear_user_messages.${this._broadcasterId}.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelChatClearUserMessagesEventData,
	): EventSubChannelChatClearUserMessagesEvent {
		return this._client._config.managed
			? new EventSubChannelChatClearUserMessagesEvent(data, this._client._config.apiClient)
			: new EventSubChannelChatClearUserMessagesEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._userId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelChatClearUserMessagesEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
