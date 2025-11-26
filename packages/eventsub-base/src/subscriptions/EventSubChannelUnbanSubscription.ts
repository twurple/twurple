import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelUnbanEvent } from '../events/EventSubChannelUnbanEvent.js';
import { type EventSubChannelUnbanEventData } from '../events/EventSubChannelUnbanEvent.external.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelUnbanSubscription extends EventSubSubscription<EventSubChannelUnbanEvent> {
	/** @protected */ readonly _cliName = 'unban';

	constructor(
		handler: (data: EventSubChannelUnbanEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.unban.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelUnbanEventData): EventSubChannelUnbanEvent {
		return new EventSubChannelUnbanEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelUnbanEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
