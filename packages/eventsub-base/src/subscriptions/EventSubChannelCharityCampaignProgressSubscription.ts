import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelCharityCampaignProgressEvent } from '../events/EventSubChannelCharityCampaignProgressEvent';
import { type EventSubChannelCharityCampaignProgressEventData } from '../events/EventSubChannelCharityCampaignProgressEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCharityCampaignProgressSubscription extends EventSubSubscription<EventSubChannelCharityCampaignProgressEvent> {
	/** @protected */ readonly _cliName = 'charity-progress';

	constructor(
		handler: (data: EventSubChannelCharityCampaignProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.charity_campaign.progress.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelCharityCampaignProgressEventData
	): EventSubChannelCharityCampaignProgressEvent {
		return new EventSubChannelCharityCampaignProgressEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelCharityCampaignProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
