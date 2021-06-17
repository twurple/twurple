import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelUnbanEventData } from '../Events/EventSubChannelUnbanEvent';
import { EventSubChannelUnbanEvent } from '../Events/EventSubChannelUnbanEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelUnbanSubscription extends EventSubSubscription<EventSubChannelUnbanEvent> {
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
		return this._client._apiClient.helix.eventSub.subscribeToChannelUnbanEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
