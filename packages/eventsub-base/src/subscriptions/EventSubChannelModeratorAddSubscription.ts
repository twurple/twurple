import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelModeratorEventData } from '../events/EventSubChannelModeratorEvent.external.js';
import { EventSubChannelModeratorEvent } from '../events/EventSubChannelModeratorEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelModeratorAddSubscription extends EventSubSubscription<EventSubChannelModeratorEvent> {
	/** @protected */ readonly _cliName = 'add-moderator';

	constructor(
		handler: (data: EventSubChannelModeratorEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.moderator.add.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelModeratorEventData): EventSubChannelModeratorEvent {
		return this._client._config.managed
			? new EventSubChannelModeratorEvent(data, this._client._config.apiClient)
			: new EventSubChannelModeratorEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelModeratorAddEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
