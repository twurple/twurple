import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelHypeTrainEndV2EventData } from '../events/EventSubChannelHypeTrainEndV2Event.external.js';
import { EventSubChannelHypeTrainEndV2Event } from '../events/EventSubChannelHypeTrainEndV2Event.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelHypeTrainEndV2Subscription extends EventSubSubscription<EventSubChannelHypeTrainEndV2Event> {
	/** @protected */ readonly _cliName = 'hype-train-end';

	constructor(
		handler: (data: EventSubChannelHypeTrainEndV2Event) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.end.v2.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelHypeTrainEndV2EventData): EventSubChannelHypeTrainEndV2Event {
		return this._client._config.managed
			? new EventSubChannelHypeTrainEndV2Event(data, this._client._config.apiClient)
			: new EventSubChannelHypeTrainEndV2Event(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelHypeTrainEndV2Events(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
