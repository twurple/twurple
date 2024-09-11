import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubChannelChatUserMessageHoldEvent } from '../events/EventSubChannelChatUserMessageHoldEvent';
import { type EventSubChannelChatUserMessageHoldEventData } from '../events/EventSubChannelChatUserMessageHoldEvent.external';

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
		return new EventSubChannelChatUserMessageHoldEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._userId,
			async ctx =>
				await ctx.eventSub.subscribeToChannelChatUserMessageHoldEvents(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
