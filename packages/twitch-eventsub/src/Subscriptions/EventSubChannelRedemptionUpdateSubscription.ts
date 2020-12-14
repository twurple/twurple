import type { HelixEventSubSubscription } from 'twitch';
import type { EventSubChannelRedemptionUpdateEventData } from '../Events/EventSubChannelRedemptionUpdateEvent';
import { EventSubChannelRedemptionUpdateEvent } from '../Events/EventSubChannelRedemptionUpdateEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
export class EventSubChannelRedemptionUpdateSubscription extends EventSubSubscription<EventSubChannelRedemptionUpdateEvent> {
	constructor(
		handler: (data: EventSubChannelRedemptionUpdateEvent) => void,
		client: EventSubListener,
		private readonly _userId: string,
		private readonly _rewardId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_custom_reward_redemption.update.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRedemptionUpdateEventData): EventSubChannelRedemptionUpdateEvent {
		return new EventSubChannelRedemptionUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		if (this._rewardId) {
			return this._client._apiClient.helix.subscribeToChannelRedemptionUpdateEventsForReward(
				this._userId,
				this._rewardId,
				await this._getTransportOptions()
			);
		} else {
			return this._client._apiClient.helix.eventSub.subscribeToChannelRedemptionUpdateEvents(
				this._userId,
				await this._getTransportOptions()
			);
		}
	}
}
