import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelShieldModeBeginEvent } from '../events/EventSubChannelShieldModeBeginEvent';
import type { EventSubChannelShieldModeBeginEventData } from '../events/EventSubChannelShieldModeBeginEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelShieldModeBeginSubscription extends EventSubSubscription<EventSubChannelShieldModeBeginEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelShieldModeBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _moderatorId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.shield_mode.begin.${this._userId}`;
	}

	protected transformData(data: EventSubChannelShieldModeBeginEventData): EventSubChannelShieldModeBeginEvent {
		return new EventSubChannelShieldModeBeginEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelShieldModeBeginEvents(
			this._userId,
			this._moderatorId,
			await this._getTransportOptions()
		);
	}
}
