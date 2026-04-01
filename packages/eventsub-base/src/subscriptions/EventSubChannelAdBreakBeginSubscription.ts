import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubChannelAdBreakBeginEventData } from '../events/EventSubChannelAdBreakBeginEvent.external.js';
import { EventSubChannelAdBreakBeginEvent } from '../events/EventSubChannelAdBreakBeginEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelAdBreakBeginSubscription extends EventSubSubscription<EventSubChannelAdBreakBeginEvent> {
	/** @protected */ readonly _cliName = 'ad-break-begin';

	constructor(
		handler: (data: EventSubChannelAdBreakBeginEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.ad_break.begin.${this._userId}`;
	}

	get authUserId(): string | null {
		return this._userId;
	}

	protected transformData(data: EventSubChannelAdBreakBeginEventData): EventSubChannelAdBreakBeginEvent {
		return this._client._config.managed
			? new EventSubChannelAdBreakBeginEvent(data, this._client._config.apiClient)
			: new EventSubChannelAdBreakBeginEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToChannelAdBreakBeginEvents(
					this._userId,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
