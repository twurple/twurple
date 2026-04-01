import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelRewardEventData } from '../events/EventSubChannelRewardEvent.external.js';
import { EventSubChannelRewardEvent } from '../events/EventSubChannelRewardEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelRewardAddSubscription extends EventSubSubscription<EventSubChannelRewardEvent> {
	/** @protected */ readonly _cliName = 'add-reward';

	constructor(
		handler: (data: EventSubChannelRewardEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_custom_reward.add.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelRewardEventData): EventSubChannelRewardEvent {
		return this._client._config.managed
			? new EventSubChannelRewardEvent(data, this._client._config.apiClient)
			: new EventSubChannelRewardEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelRewardAddEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
