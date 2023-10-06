import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelRedemptionUpdateEvent } from '../events/EventSubChannelRedemptionUpdateEvent';
import { type EventSubChannelRedemptionUpdateEventData } from '../events/EventSubChannelRedemptionUpdateEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelRedemptionUpdateSubscription extends EventSubSubscription<EventSubChannelRedemptionUpdateEvent> {
	/** @protected */ readonly _cliName = 'update-redemption';

	constructor(
		handler: (data: EventSubChannelRedemptionUpdateEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _rewardId?: string,
	) {
		super(handler, client);
	}

	get id(): string {
		if (this._rewardId == null) {
			return `channel.channel_points_custom_reward_redemption.update.${this._userId}`;
		}
		return `channel.channel_points_custom_reward_redemption.update.${this._userId}.${this._rewardId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelRedemptionUpdateEventData): EventSubChannelRedemptionUpdateEvent {
		return new EventSubChannelRedemptionUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		if (this._rewardId) {
			return await this._client._apiClient.eventSub.subscribeToChannelRedemptionUpdateEventsForReward(
				this._userId,
				this._rewardId,
				await this._getTransportOptions(),
			);
		}
		return await this._client._apiClient.eventSub.subscribeToChannelRedemptionUpdateEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
