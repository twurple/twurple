import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelHypeTrainProgressEventData } from '../events/EventSubChannelHypeTrainProgressEvent.external.js';
import { EventSubChannelHypeTrainProgressEvent } from '../events/EventSubChannelHypeTrainProgressEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelHypeTrainProgressSubscription extends EventSubSubscription<EventSubChannelHypeTrainProgressEvent> {
	/** @protected */ readonly _cliName = 'hype-train-progress';

	constructor(
		handler: (data: EventSubChannelHypeTrainProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.progress.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelHypeTrainProgressEventData): EventSubChannelHypeTrainProgressEvent {
		return this._client._config.managed
			? new EventSubChannelHypeTrainProgressEvent(data, this._client._config.apiClient)
			: new EventSubChannelHypeTrainProgressEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelHypeTrainProgressEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
