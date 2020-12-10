import type { HelixEventSubSubscription } from 'twitch';
import type { EventSubChannelRewardRemoveEventData } from '../Events/EventSubChannelRewardRemoveEvent';
import { EventSubChannelRewardRemoveEvent } from '../Events/EventSubChannelRewardRemoveEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
export class EventSubChannelRewardRemoveSubscription extends EventSubSubscription<EventSubChannelRewardRemoveEvent> {
	constructor(
		handler: (data: EventSubChannelRewardRemoveEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_custom_reward.remove.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRewardRemoveEventData): EventSubChannelRewardRemoveEvent {
		return new EventSubChannelRewardRemoveEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelRewardRemoveEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
