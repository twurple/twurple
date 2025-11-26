import { type HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';
import { EventSubChannelWarningSendEvent } from '../events/EventSubChannelWarningSendEvent.js';
import { type EventSubChannelWarningSendEventData } from '../events/EventSubChannelWarningSendEvent.external.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubChannelWarningSendSubscription extends EventSubSubscription<EventSubChannelWarningSendEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubChannelWarningSendEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.warning.send.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubChannelWarningSendEventData): EventSubChannelWarningSendEvent {
		return new EventSubChannelWarningSendEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToChannelWarningSendEvents(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
