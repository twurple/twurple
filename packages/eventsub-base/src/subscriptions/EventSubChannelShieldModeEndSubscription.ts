import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelShieldModeEndEvent } from '../events/EventSubChannelShieldModeEndEvent';
import type { EventSubChannelShieldModeEndEventData } from '../events/EventSubChannelShieldModeEndEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelShieldModeEndSubscription extends EventSubSubscription<EventSubChannelShieldModeEndEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelShieldModeEndEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _moderatorId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.shield_mode.end.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelShieldModeEndEventData): EventSubChannelShieldModeEndEvent {
		return new EventSubChannelShieldModeEndEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelShieldModeEndEvents(
			this._userId,
			this._moderatorId,
			await this._getTransportOptions()
		);
	}
}
