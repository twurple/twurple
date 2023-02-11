import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubExtensionBitsTransactionCreateEvent } from '../events/EventSubExtensionBitsTransactionCreateEvent';
import { type EventSubExtensionBitsTransactionCreateEventData } from '../events/EventSubExtensionBitsTransactionCreateEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubExtensionBitsTransactionCreateSubscription extends EventSubSubscription<EventSubExtensionBitsTransactionCreateEvent> {
	/** @protected */ readonly _cliName = 'transaction';
	readonly authUserId = null;

	constructor(
		handler: (data: EventSubExtensionBitsTransactionCreateEvent) => void,
		client: EventSubBase,
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
		return await this._client._apiClient.eventSub.subscribeToExtensionBitsTransactionCreateEvents(
			this._clientId,
			await this._getTransportOptions()
		);
	}
}
