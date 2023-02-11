import type { HelixEventSubDropEntitlementGrantFilter, HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import { EventSubDropEntitlementGrantEvent } from '../events/EventSubDropEntitlementGrantEvent';
import { type EventSubDropEntitlementGrantEventData } from '../events/EventSubDropEntitlementGrantEvent.external';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub-base', 'EventSubSubscription')
export class EventSubDropEntitlementGrantSubscription extends EventSubSubscription<EventSubDropEntitlementGrantEvent> {
	/** @protected */ readonly _cliName = 'transaction';
	readonly authUserId = null;

	constructor(
		handler: (data: EventSubDropEntitlementGrantEvent) => void,
		client: EventSubBase,
		private readonly _filter: HelixEventSubDropEntitlementGrantFilter
	) {
		super(handler, client);
	}

	get id(): string {
		return `drop.entitlement.grant.${this._filter.organizationId}.${this._filter.categoryId ?? 'all'}.${
			this._filter.campaignId ?? 'all'
		}`;
	}

	protected transformData(data: EventSubDropEntitlementGrantEventData): EventSubDropEntitlementGrantEvent {
		return new EventSubDropEntitlementGrantEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.eventSub.subscribeToDropEntitlementGrantEvents(
			this._filter,
			await this._getTransportOptions()
		);
	}
}
