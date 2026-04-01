import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelCharityCampaignStartEventData } from '../events/EventSubChannelCharityCampaignStartEvent.external.js';
import { EventSubChannelCharityCampaignStartEvent } from '../events/EventSubChannelCharityCampaignStartEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCharityCampaignStartSubscription extends EventSubSubscription<EventSubChannelCharityCampaignStartEvent> {
	/** @protected */ readonly _cliName = 'charity-start';

	constructor(
		handler: (data: EventSubChannelCharityCampaignStartEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.charity_campaign.start.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(
		data: EventSubChannelCharityCampaignStartEventData,
	): EventSubChannelCharityCampaignStartEvent {
		return this._client._config.managed
			? new EventSubChannelCharityCampaignStartEvent(data, this._client._config.apiClient)
			: new EventSubChannelCharityCampaignStartEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelCharityCampaignStartEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
