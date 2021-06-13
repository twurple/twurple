import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubExtensionBitsTransactionCreateEventData } from '../Events/EventSubExtensionBitsTransactionCreateEvent';
import { EventSubExtensionBitsTransactionCreateEvent } from '../Events/EventSubExtensionBitsTransactionCreateEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubExtensionBitsTransactionCreateSubscription extends EventSubSubscription<EventSubExtensionBitsTransactionCreateEvent> {
	constructor(
		handler: (data: EventSubExtensionBitsTransactionCreateEvent) => void,
		client: EventSubListener,
		private readonly _clientId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `extension.bits_transaction.create.${this._clientId}`;
	}

	protected transformData(
		data: EventSubExtensionBitsTransactionCreateEventData
	): EventSubExtensionBitsTransactionCreateEvent {
		return new EventSubExtensionBitsTransactionCreateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToExtensionBitsTransactionCreateEvents(
			this._clientId,
			await this._getTransportOptions()
		);
	}
}
