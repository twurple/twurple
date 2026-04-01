import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelVipEventData } from '../events/EventSubChannelVipEvent.external.js';
import { EventSubChannelVipEvent } from '../events/EventSubChannelVipEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelVipRemoveSubscription extends EventSubSubscription<EventSubChannelVipEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelVipEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.vip.remove.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelVipEventData): EventSubChannelVipEvent {
		return this._client._config.managed
			? new EventSubChannelVipEvent(data, this._client._config.apiClient)
			: new EventSubChannelVipEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelVipRemoveEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
