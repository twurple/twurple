import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelPollEndEventData } from '../events/EventSubChannelPollEndEvent.external.js';
import { EventSubChannelPollEndEvent } from '../events/EventSubChannelPollEndEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPollEndSubscription extends EventSubSubscription<EventSubChannelPollEndEvent> {
	/** @protected */ readonly _cliName = 'poll-end';

	constructor(
		handler: (data: EventSubChannelPollEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.poll.end.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelPollEndEventData): EventSubChannelPollEndEvent {
		return this._client._config.managed
			? new EventSubChannelPollEndEvent(data, this._client._config.apiClient)
			: new EventSubChannelPollEndEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelPollEndEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
