import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';
import type { EventSubChannelPollBeginEventData } from '../Events/EventSubChannelPollBeginEvent';
import { EventSubChannelPollBeginEvent } from '../Events/EventSubChannelPollBeginEvent';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelPollBeginSubscription extends EventSubSubscription<EventSubChannelPollBeginEvent> {
	constructor(
		handler: (data: EventSubChannelPollBeginEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.poll.begin.${this._userId}`;
	}

	protected transformData(data: EventSubChannelPollBeginEventData): EventSubChannelPollBeginEvent {
		return new EventSubChannelPollBeginEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelPollBeginEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
