import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelChatSettingsUpdateEventData } from '../events/EventSubChannelChatSettingsUpdateEvent.external.js';
import { EventSubChannelChatSettingsUpdateEvent } from '../events/EventSubChannelChatSettingsUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelChatSettingsUpdateSubscription extends EventSubSubscription<EventSubChannelChatSettingsUpdateEvent> {
	/** @protected */ readonly _cliName = 'chat-settings-update';

	constructor(
		handler: (data: EventSubChannelChatSettingsUpdateEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.chat_settings.update.${this._broadcasterId}.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelChatSettingsUpdateEventData): EventSubChannelChatSettingsUpdateEvent {
		return this._client._config.managed
			? new EventSubChannelChatSettingsUpdateEvent(data, this._client._config.apiClient)
			: new EventSubChannelChatSettingsUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._userId,
					async ctx =>
						await ctx.eventSub.subscribeToChannelChatSettingsUpdateEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
