import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelFollowEventData } from '../events/EventSubChannelFollowEvent';
import { EventSubChannelFollowEvent } from '../events/EventSubChannelFollowEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelFollowSubscription extends EventSubSubscription<EventSubChannelFollowEvent> {
	constructor(
		handler: (data: EventSubChannelFollowEvent) => void,
		client: EventSubBase,
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
		return await this._client._apiClient.eventSub.subscribeToChannelFollowEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
