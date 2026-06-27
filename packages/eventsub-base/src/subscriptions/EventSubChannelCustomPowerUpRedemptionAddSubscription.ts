import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';
import { EventSubChannelCustomPowerUpAddEvent } from '../events/EventSubChannelCustomPowerUpAddEvent.js';
import type { EventSubChannelCustomPowerUpAddEventData } from '../events/EventSubChannelCustomPowerUpAddEvent.external.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCustomPowerUpRedemptionAddSubscription extends EventSubSubscription<EventSubChannelCustomPowerUpAddEvent> {
	/** @protected */ readonly _cliName = 'add-power-up-redemption';

	constructor(
		handler: (data: EventSubChannelCustomPowerUpAddEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _rewardId?: string,
	) {
		super(handler, client);
	}

	get id(): string {
		if (this._rewardId == null) {
			return `channel.custom_power_up_redemption.add.${this._userId}`;
		}
		return `channel.custom_power_up_redemption.add.${this._userId}.${this._rewardId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelCustomPowerUpAddEventData): EventSubChannelCustomPowerUpAddEvent {
		return this._client._config.managed
			? new EventSubChannelCustomPowerUpAddEvent(data, this._client._config.apiClient)
			: new EventSubChannelCustomPowerUpAddEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		if (this._rewardId) {
			return this._client._config.managed
				? await this._client._config.apiClient.eventSub.subscribeToChannelPowerUpAddEventsForReward(
						this._userId,
						this._rewardId,
						await this._getTransportOptions(),
				  )
				: undefined;
		}
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelPowerUpAddEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
