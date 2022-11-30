import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelCharityCampaignStartEvent } from '../events/EventSubChannelCharityCampaignStartEvent';
import { type EventSubChannelCharityCampaignStartEventData } from '../events/EventSubChannelCharityCampaignStartEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCharityCampaignStartSubscription extends EventSubSubscription<EventSubChannelCharityCampaignStartEvent> {
	/** @protected */ readonly _cliName = 'charity-campaign-start';

	constructor(
		handler: (data: EventSubChannelCharityCampaignStartEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.charity_campaign.start.${this._userId}`;
	}

	protected transformData(
		data: EventSubChannelCharityCampaignStartEventData
	): EventSubChannelCharityCampaignStartEvent {
		return new EventSubChannelCharityCampaignStartEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelCharityCampaignStartEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
