import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelChatUserMessageUpdateEventData } from '../events/EventSubChannelChatUserMessageUpdateEvent.external.js';
import { EventSubChannelChatUserMessageUpdateEvent } from '../events/EventSubChannelChatUserMessageUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatUserMessageUpdateSubscription extends EventSubSubscription<EventSubChannelChatUserMessageUpdateEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelChatUserMessageUpdateEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.user_message_update.${this._broadcasterId}.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelChatUserMessageUpdateEventData,
	): EventSubChannelChatUserMessageUpdateEvent {
		return this._client._config.managed
			? new EventSubChannelChatUserMessageUpdateEvent(data, this._client._config.apiClient)
			: new EventSubChannelChatUserMessageUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._userId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelChatUserMessageUpdateEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
