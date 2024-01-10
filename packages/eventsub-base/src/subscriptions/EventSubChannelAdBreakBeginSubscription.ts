import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubChannelAdBreakBeginEvent } from '../events/EventSubChannelAdBreakBeginEvent';
import { type EventSubChannelAdBreakBeginEventData } from '../events/EventSubChannelAdBreakBeginEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

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
		return new EventSubChannelAdBreakBeginEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToChannelAdBreakBeginEvents(
			this._userId,
			await this._getTransportOptions(),
		);
	}
}
