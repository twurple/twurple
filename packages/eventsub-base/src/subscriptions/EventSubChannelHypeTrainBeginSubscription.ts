import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelHypeTrainBeginEventData } from '../events/EventSubChannelHypeTrainBeginEvent.external.js';
import { EventSubChannelHypeTrainBeginEvent } from '../events/EventSubChannelHypeTrainBeginEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelHypeTrainBeginSubscription extends EventSubSubscription<EventSubChannelHypeTrainBeginEvent> {
	/** @protected */ readonly _cliName = 'hype-train-begin';

	constructor(
		handler: (data: EventSubChannelHypeTrainBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.begin.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelHypeTrainBeginEventData): EventSubChannelHypeTrainBeginEvent {
		return this._client._config.managed
			? new EventSubChannelHypeTrainBeginEvent(data, this._client._config.apiClient)
			: new EventSubChannelHypeTrainBeginEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelHypeTrainBeginEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
