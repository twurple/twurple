import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelPollBeginEvent } from '../events/EventSubChannelPollBeginEvent.js';
import { type EventSubChannelPollBeginEventData } from '../events/EventSubChannelPollBeginEvent.external.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPollBeginSubscription extends EventSubSubscription<EventSubChannelPollBeginEvent> {
	/** @protected */ readonly _cliName = 'poll-begin';

	constructor(
		handler: (data: EventSubChannelPollBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.poll.begin.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelPollBeginEventData): EventSubChannelPollBeginEvent {
		return new EventSubChannelPollBeginEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelPollBeginEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
