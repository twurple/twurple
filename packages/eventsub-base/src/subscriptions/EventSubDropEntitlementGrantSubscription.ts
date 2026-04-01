import type { HelixEventSubDropEntitlementGrantFilter, HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { type EventSubDropEntitlementGrantEventData } from '../events/EventSubDropEntitlementGrantEvent.external.js';
import { EventSubDropEntitlementGrantEvent } from '../events/EventSubDropEntitlementGrantEvent.js';
import type { EventSubBase } from '../EventSubBase.js';
import { EventSubSubscription } from './EventSubSubscription.js';

/** @internal */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubDropEntitlementGrantSubscription extends EventSubSubscription<EventSubDropEntitlementGrantEvent> {
	/** @protected */ readonly _cliName = 'drop';
	readonly authUserId = null;

	constructor(
		handler: (data: EventSubDropEntitlementGrantEvent) => void,
		client: EventSubBase,
		private readonly _filter: HelixEventSubDropEntitlementGrantFilter,
	) {
		super(handler, client);
	}

	get id(): string {
		return `drop.entitlement.grant.${this._filter.organizationId}.${this._filter.categoryId ?? 'all'}.${
			this._filter.campaignId ?? 'all'
		}`;
	}

	protected transformData(data: EventSubDropEntitlementGrantEventData): EventSubDropEntitlementGrantEvent {
		return this._client._config.managed
			? new EventSubDropEntitlementGrantEvent(data, this._client._config.apiClient)
			: new EventSubDropEntitlementGrantEvent(data);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription | undefined> {
		return this._client._config.managed
			? await this._client._config.apiClient.eventSub.subscribeToDropEntitlementGrantEvents(
					this._filter,
					await this._getTransportOptions(),
			  )
			: undefined;
	}
}
