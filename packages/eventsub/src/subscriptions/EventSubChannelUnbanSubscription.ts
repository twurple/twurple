import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelUnbanEventData } from '../events/EventSubChannelUnbanEvent';
import { EventSubChannelUnbanEvent } from '../events/EventSubChannelUnbanEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelUnbanSubscription extends EventSubSubscription<EventSubChannelUnbanEvent> {
	protected readonly _cliName = 'unban';

	constructor(
		handler: (data: EventSubChannelUnbanEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.unban.${this._userId}`;
	}

	protected transformData(data: EventSubChannelUnbanEventData): EventSubChannelUnbanEvent {
		return new EventSubChannelUnbanEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelUnbanEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
