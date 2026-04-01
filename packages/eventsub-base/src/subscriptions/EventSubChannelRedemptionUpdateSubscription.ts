import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelRedemptionUpdateEventData } from '../events/EventSubChannelRedemptionUpdateEvent.external.js';
import { EventSubChannelRedemptionUpdateEvent } from '../events/EventSubChannelRedemptionUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

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
		return this._client._config.managed
			? new EventSubChannelRedemptionUpdateEvent(data, this._client._config.apiClient)
			: new EventSubChannelRedemptionUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		if (this._rewardId) {
			return this._client._config.managed
				? await this._client._config.apiClient.eventSub.subscribeToChannelRedemptionUpdateEventsForReward(
						this._userId,
						this._rewardId,
						await this._getTransportOptions(),
				  )
				: undefined;
		}
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelRedemptionUpdateEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
