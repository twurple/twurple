import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelCharityCampaignStopEvent } from '../events/EventSubChannelCharityCampaignStopEvent';
import { type EventSubChannelCharityCampaignStopEventData } from '../events/EventSubChannelCharityCampaignStopEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCharityCampaignStopSubscription extends EventSubSubscription<EventSubChannelCharityCampaignStopEvent> {
	/** @protected */ readonly _cliName = 'charity-stop';

	constructor(
		handler: (data: EventSubChannelCharityCampaignStopEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.charity_campaign.stop.${this._userId}`;
	}

	protected transformData(
		data: EventSubChannelCharityCampaignStopEventData
	): EventSubChannelCharityCampaignStopEvent {
		return new EventSubChannelCharityCampaignStopEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelCharityCampaignStopEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
