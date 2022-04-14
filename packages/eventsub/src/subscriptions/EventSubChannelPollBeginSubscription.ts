import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelPollBeginEventData } from '../events/EventSubChannelPollBeginEvent';
import { EventSubChannelPollBeginEvent } from '../events/EventSubChannelPollBeginEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelPollBeginSubscription extends EventSubSubscription<EventSubChannelPollBeginEvent> {
	protected readonly _cliName = 'poll-begin';

	constructor(
		handler: (data: EventSubChannelPollBeginEvent) => void,
		client: EventSubBase,
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
		return await this._client._apiClient.eventSub.subscribeToChannelPollBeginEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
