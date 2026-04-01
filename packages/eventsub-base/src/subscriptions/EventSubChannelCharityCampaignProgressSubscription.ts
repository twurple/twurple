import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelCharityCampaignProgressEventData } from '../events/EventSubChannelCharityCampaignProgressEvent.external.js';
import { EventSubChannelCharityCampaignProgressEvent } from '../events/EventSubChannelCharityCampaignProgressEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCharityCampaignProgressSubscription extends EventSubSubscription<EventSubChannelCharityCampaignProgressEvent> {
	/** @protected */ readonly _cliName = 'charity-progress';

	constructor(
		handler: (data: EventSubChannelCharityCampaignProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
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
		data: EventSubChannelCharityCampaignProgressEventData,
	): EventSubChannelCharityCampaignProgressEvent {
		return this._client._config.managed
			? new EventSubChannelCharityCampaignProgressEvent(data, this._client._config.apiClient)
			: new EventSubChannelCharityCampaignProgressEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelCharityCampaignProgressEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
