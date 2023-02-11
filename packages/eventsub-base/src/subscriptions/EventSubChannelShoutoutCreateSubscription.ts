import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelShoutoutCreateEvent } from '../events/EventSubChannelShoutoutCreateEvent';
import { type EventSubChannelShoutoutCreateEventData } from '../events/EventSubChannelShoutoutCreateEvent.external';
import { type EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelShoutoutCreateSubscription extends EventSubSubscription<EventSubChannelShoutoutCreateEvent> {
	/** @protected */ readonly _cliName = 'shoutout-create';

	constructor(
		handler: (data: EventSubChannelShoutoutCreateEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _moderatorId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.shoutout.create.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelShoutoutCreateEventData): EventSubChannelShoutoutCreateEvent {
		return new EventSubChannelShoutoutCreateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelShoutoutCreateEvents(
			this._userId,
			this._moderatorId,
			await this._getTransportOptions()
		);
	}
}
