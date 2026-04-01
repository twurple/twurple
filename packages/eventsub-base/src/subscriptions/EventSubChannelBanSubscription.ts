import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelBanEventData } from '../events/EventSubChannelBanEvent.external.js';
import { EventSubChannelBanEvent } from '../events/EventSubChannelBanEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelBanSubscription extends EventSubSubscription<EventSubChannelBanEvent> {
	/** @protected */ readonly _cliName = 'ban';

	constructor(
		handler: (data: EventSubChannelBanEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.ban.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelBanEventData): EventSubChannelBanEvent {
		return this._client._config.managed
			? new EventSubChannelBanEvent(data, this._client._config.apiClient)
			: new EventSubChannelBanEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelBanEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
