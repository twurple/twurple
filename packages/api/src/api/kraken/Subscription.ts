import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol } from '@twurple/common';
import type { ApiClient } from '../../ApiClient';

/** @private */
export interface SubscriptionData {
	_id: string;
	sub_plan: string;
	sub_plan_name: string;
	created_at: string;
}

/**
 * A subscription to a Twitch channel.
 */
export abstract class Subscription extends DataObject<SubscriptionData> {
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: SubscriptionData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the subscription.
	 */
	get id(): string {
		return this[rawDataSymbol]._id;
	}

	/**
	 * The identifier of the subscription plan.
	 */
	get subPlan(): string {
		return this[rawDataSymbol].sub_plan;
	}

	/**
	 * The name of the subscription plan.
	 */
	get subPlanName(): string {
		return this[rawDataSymbol].sub_plan_name;
	}

	/**
	 * The date when the subscription was started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}
}
