import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelRewardEventData } from '../events/EventSubChannelRewardEvent';
import { EventSubChannelRewardEvent } from '../events/EventSubChannelRewardEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelRewardAddSubscription extends EventSubSubscription<EventSubChannelRewardEvent> {
	constructor(
		handler: (data: EventSubChannelRewardEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_custom_reward.add.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRewardEventData): EventSubChannelRewardEvent {
		return new EventSubChannelRewardEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.helix.eventSub.subscribeToChannelRewardAddEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
