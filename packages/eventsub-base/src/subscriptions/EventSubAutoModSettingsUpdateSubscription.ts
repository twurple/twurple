import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';
import { EventSubAutoModSettingsUpdateEvent } from '../events/EventSubAutoModSettingsUpdateEvent';
import { type EventSubAutoModSettingsUpdateEventData } from '../events/EventSubAutoModSettingsUpdateEvent.external';

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
		return new EventSubAutoModSettingsUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.asUser(
			this._moderatorId,
			async ctx =>
				await ctx.eventSub.subscribeToAutoModSettingsUpdateEvents(
					this._broadcasterId,
					await this._getTransportOptions(),
				),
		);
	}
}
