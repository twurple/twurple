import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubAutoModMessageUpdateEventData } from '../events/EventSubAutoModMessageUpdateEvent.external.js';
import { EventSubAutoModMessageUpdateEvent } from '../events/EventSubAutoModMessageUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubAutoModMessageUpdateSubscription extends EventSubSubscription<EventSubAutoModMessageUpdateEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubAutoModMessageUpdateEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `automod.message.update.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubAutoModMessageUpdateEventData): EventSubAutoModMessageUpdateEvent {
		return this._client._config.managed
			? new EventSubAutoModMessageUpdateEvent(data, this._client._config.apiClient)
			: new EventSubAutoModMessageUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToAutoModMessageUpdateEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
