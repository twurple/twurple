import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelRedemptionAddEventData } from '../events/EventSubChannelRedemptionAddEvent.external.js';
import { EventSubChannelRedemptionAddEvent } from '../events/EventSubChannelRedemptionAddEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelRedemptionAddSubscription extends EventSubSubscription<EventSubChannelRedemptionAddEvent> {
	/** @protected */ readonly _cliName = 'add-redemption';

	constructor(
		handler: (data: EventSubChannelRedemptionAddEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _rewardId?: string,
	) {
		super(handler, client);
	}

	get id(): string {
		if (this._rewardId == null) {
			return `channel.channel_points_custom_reward_redemption.add.${this._userId}`;
		}
		return `channel.channel_points_custom_reward_redemption.add.${this._userId}.${this._rewardId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelRedemptionAddEventData): EventSubChannelRedemptionAddEvent {
		return this._client._config.managed
			? new EventSubChannelRedemptionAddEvent(data, this._client._config.apiClient)
			: new EventSubChannelRedemptionAddEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		if (this._rewardId) {
			return this._client._config.managed
				? await this._client._config.apiClient.eventSub.subscribeToChannelRedemptionAddEventsForReward(
						this._userId,
						this._rewardId,
						await this._getTransportOptions(),
				  )
				: undefined;
		}
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelRedemptionAddEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
