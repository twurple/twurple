import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelCharityCampaignStopEventData } from '../events/EventSubChannelCharityCampaignStopEvent.external.js';
import { EventSubChannelCharityCampaignStopEvent } from '../events/EventSubChannelCharityCampaignStopEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCharityCampaignStopSubscription extends EventSubSubscription<EventSubChannelCharityCampaignStopEvent> {
	/** @protected */ readonly _cliName = 'charity-stop';

	constructor(
		handler: (data: EventSubChannelCharityCampaignStopEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.charity_campaign.stop.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelCharityCampaignStopEventData,
	): EventSubChannelCharityCampaignStopEvent {
		return this._client._config.managed
			? new EventSubChannelCharityCampaignStopEvent(data, this._client._config.apiClient)
			: new EventSubChannelCharityCampaignStopEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelCharityCampaignStopEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
