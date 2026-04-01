import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelHypeTrainEndEventData } from '../events/EventSubChannelHypeTrainEndEvent.external.js';
import { EventSubChannelHypeTrainEndEvent } from '../events/EventSubChannelHypeTrainEndEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelHypeTrainEndSubscription extends EventSubSubscription<EventSubChannelHypeTrainEndEvent> {
	/** @protected */ readonly _cliName = 'hype-train-end';

	constructor(
		handler: (data: EventSubChannelHypeTrainEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.end.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelHypeTrainEndEventData): EventSubChannelHypeTrainEndEvent {
		return this._client._config.managed
			? new EventSubChannelHypeTrainEndEvent(data, this._client._config.apiClient)
			: new EventSubChannelHypeTrainEndEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelHypeTrainEndEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
