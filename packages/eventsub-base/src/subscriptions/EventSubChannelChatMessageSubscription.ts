import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelChatMessageEventData } from '../events/EventSubChannelChatMessageEvent.external.js';
import { EventSubChannelChatMessageEvent } from '../events/EventSubChannelChatMessageEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatMessageSubscription extends EventSubSubscription<EventSubChannelChatMessageEvent> {
	/** @protected */ readonly _cliName = 'chat-notification';

	constructor(
		handler: (data: EventSubChannelChatMessageEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.message.${this._broadcasterId}.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelChatMessageEventData): EventSubChannelChatMessageEvent {
		return this._client._config.managed
			? new EventSubChannelChatMessageEvent(data, this._client._config.apiClient)
			: new EventSubChannelChatMessageEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._userId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelChatMessageEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
