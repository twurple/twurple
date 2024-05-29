import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubChannelAutomaticRewardRedemptionAddEvent } from '../events/EventSubChannelAutomaticRewardRedemptionAddEvent';
import { type EventSubChannelAutomaticRewardRedemptionAddEventData } from '../events/EventSubChannelAutomaticRewardRedemptionAddEvent.external';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelAutomaticRewardRedemptionAddSubscription extends EventSubSubscription<EventSubChannelAutomaticRewardRedemptionAddEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelAutomaticRewardRedemptionAddEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_automatic_reward_redemption.add.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelAutomaticRewardRedemptionAddEventData,
	): EventSubChannelAutomaticRewardRedemptionAddEvent {
		return new EventSubChannelAutomaticRewardRedemptionAddEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelAutomaticRewardRedemptionAddEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
