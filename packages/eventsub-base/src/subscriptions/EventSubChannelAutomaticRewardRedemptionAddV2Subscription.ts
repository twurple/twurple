import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelAutomaticRewardRedemptionAddV2EventData } from '../events/EventSubChannelAutomaticRewardRedemptionAddV2Event.external.js';
import { EventSubChannelAutomaticRewardRedemptionAddV2Event } from '../events/EventSubChannelAutomaticRewardRedemptionAddV2Event.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelAutomaticRewardRedemptionAddV2Subscription extends EventSubSubscription<EventSubChannelAutomaticRewardRedemptionAddV2Event> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelAutomaticRewardRedemptionAddV2Event) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_automatic_reward_redemption.add.v2.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelAutomaticRewardRedemptionAddV2EventData,
	): EventSubChannelAutomaticRewardRedemptionAddV2Event {
		return this._client._config.managed
			? new EventSubChannelAutomaticRewardRedemptionAddV2Event(data, this._client._config.apiClient)
			: new EventSubChannelAutomaticRewardRedemptionAddV2Event(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelAutomaticRewardRedemptionAddV2Events(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
