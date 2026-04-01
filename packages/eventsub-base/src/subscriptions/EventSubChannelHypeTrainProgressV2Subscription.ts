import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelHypeTrainProgressV2EventData } from '../events/EventSubChannelHypeTrainProgressV2Event.external.js';
import { EventSubChannelHypeTrainProgressV2Event } from '../events/EventSubChannelHypeTrainProgressV2Event.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelHypeTrainProgressV2Subscription extends EventSubSubscription<EventSubChannelHypeTrainProgressV2Event> {
	/** @protected */ readonly _cliName = 'hype-train-progress';

	constructor(
		handler: (data: EventSubChannelHypeTrainProgressV2Event) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.progress.v2.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelHypeTrainProgressV2EventData,
	): EventSubChannelHypeTrainProgressV2Event {
		return this._client._config.managed
			? new EventSubChannelHypeTrainProgressV2Event(data, this._client._config.apiClient)
			: new EventSubChannelHypeTrainProgressV2Event(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelHypeTrainProgressV2Events(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
