import type { HelixEventSubSubscription } from 'twitch';
import type { EventSubChannelRewardUpdateEventData } from '../Events/EventSubChannelRewardUpdateEvent';
import { EventSubChannelRewardUpdateEvent } from '../Events/EventSubChannelRewardUpdateEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
export class EventSubChannelRewardUpdateSubscription extends EventSubSubscription<EventSubChannelRewardUpdateEvent> {
	constructor(
		handler: (data: EventSubChannelRewardUpdateEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_custom_reward.update.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRewardUpdateEventData): EventSubChannelRewardUpdateEvent {
		return new EventSubChannelRewardUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelRewardUpdateEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
