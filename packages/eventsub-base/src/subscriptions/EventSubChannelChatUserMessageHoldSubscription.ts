import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelChatUserMessageHoldEventData } from '../events/EventSubChannelChatUserMessageHoldEvent.external.js';
import { EventSubChannelChatUserMessageHoldEvent } from '../events/EventSubChannelChatUserMessageHoldEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatUserMessageHoldSubscription extends EventSubSubscription<EventSubChannelChatUserMessageHoldEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelChatUserMessageHoldEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat.user_message_hold.${this._broadcasterId}.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelChatUserMessageHoldEventData,
	): EventSubChannelChatUserMessageHoldEvent {
		return this._client._config.managed
			? new EventSubChannelChatUserMessageHoldEvent(data, this._client._config.apiClient)
			: new EventSubChannelChatUserMessageHoldEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._userId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelChatUserMessageHoldEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
