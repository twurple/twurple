import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubAutoModSettingsUpdateEventData } from '../events/EventSubAutoModSettingsUpdateEvent.external.js';
import { EventSubAutoModSettingsUpdateEvent } from '../events/EventSubAutoModSettingsUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubAutoModSettingsUpdateSubscription extends EventSubSubscription<EventSubAutoModSettingsUpdateEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubAutoModSettingsUpdateEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `automod.settings.update.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubAutoModSettingsUpdateEventData): EventSubAutoModSettingsUpdateEvent {
		return this._client._config.managed
			? new EventSubAutoModSettingsUpdateEvent(data, this._client._config.apiClient)
			: new EventSubAutoModSettingsUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToAutoModSettingsUpdateEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
