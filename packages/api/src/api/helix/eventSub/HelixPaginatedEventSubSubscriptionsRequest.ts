import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { HelixPaginatedRequestWithTotal } from '../HelixPaginatedRequestWithTotal';
import type { HelixPaginatedEventSubSubscriptionsResponse } from './HelixEventSubApi';
import type { HelixEventSubSubscriptionData } from './HelixEventSubSubscription';
import { HelixEventSubSubscription } from './HelixEventSubSubscription';

/**
 * A special case of {@HelixPaginatedRequestWithTotal} with support for fetching the total cost and cost limit
 * of EventSub subscriptions.
 *
 * @inheritDoc
 */
@rtfm('api', 'HelixPaginatedEventSubSubscriptionsRequest')
export class HelixPaginatedEventSubSubscriptionsRequest extends HelixPaginatedRequestWithTotal<
	HelixEventSubSubscriptionData,
	HelixEventSubSubscription
> {
	/** @private */
	protected declare _currentData?: HelixPaginatedEventSubSubscriptionsResponse;

	/** @private */
	constructor(query: Record<string, string>, client: ApiClient) {
		super(
			{
				url: 'eventsub/subscriptions',
				query
			},
			client,
			data => new HelixEventSubSubscription(data, client)
		);
	}

	/**
	 * Retrieves and returns the total cost of EventSub subscriptions.
	 */
	async getTotalCost(): Promise<number> {
		const data =
			this._currentData ??
			((await this._fetchData({ query: { after: undefined } })) as HelixPaginatedEventSubSubscriptionsResponse);
		return data.total_cost;
	}

	/**
	 * Retrieves and returns the cost limit of EventSub subscriptions.
	 */
	async getMaxTotalCost(): Promise<number> {
		const data =
			this._currentData ??
			((await this._fetchData({ query: { after: undefined } })) as HelixPaginatedEventSubSubscriptionsResponse);
		return data.max_total_cost;
	}
}
