import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelPollProgressEventData } from '../events/EventSubChannelPollProgressEvent.external.js';
import { EventSubChannelPollProgressEvent } from '../events/EventSubChannelPollProgressEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPollProgressSubscription extends EventSubSubscription<EventSubChannelPollProgressEvent> {
	/** @protected */ readonly _cliName = 'poll-progress';

	constructor(
		handler: (data: EventSubChannelPollProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.poll.progress.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelPollProgressEventData): EventSubChannelPollProgressEvent {
		return this._client._config.managed
			? new EventSubChannelPollProgressEvent(data, this._client._config.apiClient)
			: new EventSubChannelPollProgressEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelPollProgressEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
