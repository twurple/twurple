import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelRewardEventData } from '../Events/EventSubChannelRewardEvent';
import { EventSubChannelRewardEvent } from '../Events/EventSubChannelRewardEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
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
		return this._client._apiClient.helix.eventSub.subscribeToChannelRewardAddEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
