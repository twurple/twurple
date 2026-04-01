import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelHypeTrainBeginV2EventData } from '../events/EventSubChannelHypeTrainBeginV2Event.external.js';
import { EventSubChannelHypeTrainBeginV2Event } from '../events/EventSubChannelHypeTrainBeginV2Event.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelHypeTrainBeginV2Subscription extends EventSubSubscription<EventSubChannelHypeTrainBeginV2Event> {
	/** @protected */ readonly _cliName = 'hype-train-begin';

	constructor(
		handler: (data: EventSubChannelHypeTrainBeginV2Event) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.begin.v2.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelHypeTrainBeginV2EventData): EventSubChannelHypeTrainBeginV2Event {
		return this._client._config.managed
			? new EventSubChannelHypeTrainBeginV2Event(data, this._client._config.apiClient)
			: new EventSubChannelHypeTrainBeginV2Event(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelHypeTrainBeginV2Events(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
