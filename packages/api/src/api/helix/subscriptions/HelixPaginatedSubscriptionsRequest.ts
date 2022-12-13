import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import {
	type HelixPaginatedSubscriptionsResponse,
	type HelixSubscriptionData
} from '../../../interfaces/helix/subscription.external';
import { HelixPaginatedRequestWithTotal } from '../HelixPaginatedRequestWithTotal';
import { HelixSubscription } from './HelixSubscription';

/**
 * A special case of {@link HelixPaginatedRequestWithTotal}
 * with support for fetching the total sub points of a broadcaster.
 *
 * @inheritDoc
 */
@rtfm('api', 'HelixPaginatedSubscriptionsRequest')
export class HelixPaginatedSubscriptionsRequest extends HelixPaginatedRequestWithTotal<
	HelixSubscriptionData,
	HelixSubscription
> {
	/** @private */
	protected declare _currentData?: HelixPaginatedSubscriptionsResponse;

	/** @private */
	constructor(query: Record<string, string>, client: ApiClient) {
		super(
			{
				url: 'subscriptions',
				scope: 'channel:read:subscriptions',
				query
			},
			client,
			data => new HelixSubscription(data, client)
		);
	}

	/**
	 * Retrieves and returns the total sub points of the broadcaster.
	 */
	async getPoints(): Promise<number> {
		const data =
			this._currentData ??
			((await this._fetchData({ query: { after: undefined } })) as HelixPaginatedSubscriptionsResponse);
		return data.points;
	}
}
