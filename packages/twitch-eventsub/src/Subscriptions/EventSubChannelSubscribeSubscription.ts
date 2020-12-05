import type { HelixEventSubSubscription } from 'twitch';
import type { EventSubChannelSubscribeEventData } from '../Events/EventSubChannelSubscribeEvent';
import { EventSubChannelSubscribeEvent } from '../Events/EventSubChannelSubscribeEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
export class EventSubChannelSubscribeSubscription extends EventSubSubscription<EventSubChannelSubscribeEvent> {
	constructor(
		handler: (data: EventSubChannelSubscribeEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.subscribe.${this._userId}`;
	}

	protected transformData(data: EventSubChannelSubscribeEventData): EventSubChannelSubscribeEvent {
		return new EventSubChannelSubscribeEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelSubscribeEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
