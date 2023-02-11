import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelPollProgressEvent } from '../events/EventSubChannelPollProgressEvent';
import { type EventSubChannelPollProgressEventData } from '../events/EventSubChannelPollProgressEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelPollProgressSubscription extends EventSubSubscription<EventSubChannelPollProgressEvent> {
	/** @protected */ readonly _cliName = 'poll-progress';

	constructor(
		handler: (data: EventSubChannelPollProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
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
		return new EventSubChannelPollProgressEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelPollProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
