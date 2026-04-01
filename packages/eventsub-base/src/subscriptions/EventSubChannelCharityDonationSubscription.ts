import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelCharityDonationEventData } from '../events/EventSubChannelCharityDonationEvent.external.js';
import { EventSubChannelCharityDonationEvent } from '../events/EventSubChannelCharityDonationEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCharityDonationSubscription extends EventSubSubscription<EventSubChannelCharityDonationEvent> {
	/** @protected */ readonly _cliName = 'charity-donation';

	constructor(
		handler: (data: EventSubChannelCharityDonationEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.charity_campaign.donate.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelCharityDonationEventData): EventSubChannelCharityDonationEvent {
		return this._client._config.managed
			? new EventSubChannelCharityDonationEvent(data, this._client._config.apiClient)
			: new EventSubChannelCharityDonationEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelCharityDonationEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
