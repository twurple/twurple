import { rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import {
	type HelixEventSubSubscriptionData,
	type HelixPaginatedEventSubSubscriptionsResponse,
} from '../../interfaces/endpoints/eventSub.external.js';
import { HelixPaginatedRequestWithTotal } from '../../utils/pagination/HelixPaginatedRequestWithTotal.js';
import { HelixEventSubSubscription } from './HelixEventSubSubscription.js';

/**
 * A special case of {@link HelixPaginatedRequestWithTotal} with support for fetching the total cost and cost limit
 * of EventSub subscriptions.
 *
 * @inheritDoc
 */
@rtfm('api', 'HelixPaginatedEventSubSubscriptionsRequest')
export class HelixPaginatedEventSubSubscriptionsRequest extends HelixPaginatedRequestWithTotal<
	HelixEventSubSubscriptionData,
	HelixEventSubSubscription
> {
	/** @internal */ protected declare _currentData?: HelixPaginatedEventSubSubscriptionsResponse;

	/** @internal */
	constructor(query: Record<string, string>, userId: string | undefined, client: BaseApiClient) {
		super(
			{
				url: 'eventsub/subscriptions',
				userId,
				query,
			},
			client,
			data => new HelixEventSubSubscription(data, client),
		);
	}

	/**
	 * Gets the total cost of EventSub subscriptions.
	 */
	async getTotalCost(): Promise<number> {
		const data =
			this._currentData ??
			((await this._fetchData({ query: { after: undefined } })) as HelixPaginatedEventSubSubscriptionsResponse);
		return data.total_cost;
	}

	/**
	 * Gets the cost limit of EventSub subscriptions.
	 */
	async getMaxTotalCost(): Promise<number> {
		const data =
			this._currentData ??
			((await this._fetchData({ query: { after: undefined } })) as HelixPaginatedEventSubSubscriptionsResponse);
		return data.max_total_cost;
	}
}
