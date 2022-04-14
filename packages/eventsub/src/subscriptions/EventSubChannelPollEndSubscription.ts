import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelPollEndEventData } from '../events/EventSubChannelPollEndEvent';
import { EventSubChannelPollEndEvent } from '../events/EventSubChannelPollEndEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelPollEndSubscription extends EventSubSubscription<EventSubChannelPollEndEvent> {
	protected readonly _cliName = 'poll-end';

	constructor(
		handler: (data: EventSubChannelPollEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.poll.end.${this._userId}`;
	}

	protected transformData(data: EventSubChannelPollEndEventData): EventSubChannelPollEndEvent {
		return new EventSubChannelPollEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelPollEndEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
