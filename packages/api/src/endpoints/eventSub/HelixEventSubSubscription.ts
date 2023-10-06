import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { BaseApiClient } from '../../client/BaseApiClient';
import {
	type HelixEventSubSubscriptionData,
	type HelixEventSubSubscriptionStatus,
	type HelixEventSubTransportData,
} from '../../interfaces/endpoints/eventSub.external';

/**
 * An EventSub subscription.
 */
@rtfm<HelixEventSubSubscription>('api', 'HelixEventSubSubscription', 'id')
export class HelixEventSubSubscription extends DataObject<HelixEventSubSubscriptionData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixEventSubSubscriptionData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the subscription.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The status of the subscription.
	 */
	get status(): HelixEventSubSubscriptionStatus {
		return this[rawDataSymbol].status;
	}

	/**
	 * The event type that the subscription is listening to.
	 */
	get type(): string {
		return this[rawDataSymbol].type;
	}

	/**
	 * The cost of the subscription.
	 */
	get cost(): number {
		return this[rawDataSymbol].cost;
	}

	/**
	 * The condition of the subscription.
	 */
	get condition(): Record<string, unknown> {
		return this[rawDataSymbol].condition;
	}

	/**
	 * The date and time of creation of the subscription.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * End the EventSub subscription.
	 */
	async unsubscribe(): Promise<void> {
		await this._client.eventSub.deleteSubscription(this[rawDataSymbol].id);
	}

	/** @private */
	get _transport(): HelixEventSubTransportData {
		return this[rawDataSymbol].transport;
	}

	/** @private */
	set _status(status: HelixEventSubSubscriptionStatus) {
		this[rawDataSymbol].status = status;
	}
}
