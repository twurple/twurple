import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelRewardEvent } from '../events/EventSubChannelRewardEvent';
import { type EventSubChannelRewardEventData } from '../events/EventSubChannelRewardEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

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
		return new EventSubChannelRewardEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelRewardAddEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
