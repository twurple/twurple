import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubChannelBanEventData } from '../events/EventSubChannelBanEvent';
import { EventSubChannelBanEvent } from '../events/EventSubChannelBanEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubChannelBanSubscription extends EventSubSubscription<EventSubChannelBanEvent> {
	constructor(
		handler: (data: EventSubChannelBanEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.ban.${this._userId}`;
	}

	protected transformData(data: EventSubChannelBanEventData): EventSubChannelBanEvent {
		return new EventSubChannelBanEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.helix.eventSub.subscribeToChannelBanEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
