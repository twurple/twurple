import type { HelixEventSubSubscription } from 'twitch';
import type { EventSubChannelRewardAddEventData } from '../Events/EventSubChannelRewardAddEvent';
import { EventSubChannelRewardAddEvent } from '../Events/EventSubChannelRewardAddEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
export class EventSubChannelRewardAddSubscription extends EventSubSubscription<EventSubChannelRewardAddEvent> {
	constructor(
		handler: (data: EventSubChannelRewardAddEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_custom_reward.add.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRewardAddEventData): EventSubChannelRewardAddEvent {
		return new EventSubChannelRewardAddEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventsub.subscribeToChannelRewardAddEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
