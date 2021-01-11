import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelFollowEventData } from '../Events/EventSubChannelFollowEvent';
import { EventSubChannelFollowEvent } from '../Events/EventSubChannelFollowEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelFollowSubscription extends EventSubSubscription<EventSubChannelFollowEvent> {
	constructor(
		handler: (data: EventSubChannelFollowEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.follow.${this._userId}`;
	}

	protected transformData(data: EventSubChannelFollowEventData): EventSubChannelFollowEvent {
		return new EventSubChannelFollowEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelFollowEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
