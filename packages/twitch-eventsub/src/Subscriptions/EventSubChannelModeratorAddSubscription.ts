import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelModeratorEventData } from '../Events/EventSubChannelModeratorEvent';
import { EventSubChannelModeratorEvent } from '../Events/EventSubChannelModeratorEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelModeratorAddSubscription extends EventSubSubscription<EventSubChannelModeratorEvent> {
	constructor(
		handler: (data: EventSubChannelModeratorEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.moderator.add.${this._userId}`;
	}

	protected transformData(data: EventSubChannelModeratorEventData): EventSubChannelModeratorEvent {
		return new EventSubChannelModeratorEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelModeratorAddEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
