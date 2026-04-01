import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubAutoModTermsUpdateEventData } from '../events/EventSubAutoModTermsUpdateEvent.external.js';
import { EventSubAutoModTermsUpdateEvent } from '../events/EventSubAutoModTermsUpdateEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubAutoModTermsUpdateSubscription extends EventSubSubscription<EventSubAutoModTermsUpdateEvent> {
	/** @protected */ readonly _cliName = '';

	constructor(
		handler: (data: EventSubAutoModTermsUpdateEvent) => void,
		client: EventSubBase,
		private readonly _broadcasterId: string,
		private readonly _moderatorId: string,
	) {
		super(handler, client);
	}

	get id(): string {
		return `automod.terms.update.${this._broadcasterId}.${this._moderatorId}`;
	}

	get authUserId(): string | null {
		return this._moderatorId;
	}

	protected transformData(data: EventSubAutoModTermsUpdateEventData): EventSubAutoModTermsUpdateEvent {
		return this._client._config.managed
			? new EventSubAutoModTermsUpdateEvent(data, this._client._config.apiClient)
			: new EventSubAutoModTermsUpdateEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.asUser(
					this._moderatorId,
					async ctx =>
						await ctx.eventSub.subscribeToAutoModTermsUpdateEvents(
							this._broadcasterId,
							await this._getTransportOptions(),
						),
			  )
			: undefined;
	}
}
