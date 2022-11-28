import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelCharityDonationEvent } from '../events/EventSubChannelCharityDonationEvent';
import type { EventSubChannelCharityDonationEventData } from '../events/EventSubChannelCharityDonationEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelCharityDonationSubscription extends EventSubSubscription<EventSubChannelCharityDonationEvent> {
	/** @protected */ readonly _cliName = 'charity-campaign-donate';

	constructor(
		handler: (data: EventSubChannelCharityDonationEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.charity_campaign.donate.${this._userId}`;
	}

	protected transformData(data: EventSubChannelCharityDonationEventData): EventSubChannelCharityDonationEvent {
		return new EventSubChannelCharityDonationEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelCharityDonationEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
