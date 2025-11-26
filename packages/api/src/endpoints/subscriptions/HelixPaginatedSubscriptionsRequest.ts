import { createBroadcasterQuery } from '@twurple/api-call';
import { extractUserId, rtfm, type UserIdResolvable } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import {
	type HelixPaginatedSubscriptionsResponse,
	type HelixSubscriptionData,
} from '../../interfaces/endpoints/subscription.external.js';
import { HelixPaginatedRequestWithTotal } from '../../utils/pagination/HelixPaginatedRequestWithTotal.js';
import { HelixSubscription } from './HelixSubscription.js';

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
	/** @internal */
	protected declare _currentData?: HelixPaginatedSubscriptionsResponse;

	/** @internal */
	constructor(broadcaster: UserIdResolvable, client: BaseApiClient) {
		super(
			{
				url: 'subscriptions',
				scopes: ['channel:read:subscriptions'],
				userId: extractUserId(broadcaster),
				query: createBroadcasterQuery(broadcaster),
			},
			client,
			data => new HelixSubscription(data, client),
		);
	}

	/**
	 * Gets the total sub points of the broadcaster.
	 */
	async getPoints(): Promise<number> {
		const data =
			this._currentData ??
			((await this._fetchData({ query: { after: undefined } })) as HelixPaginatedSubscriptionsResponse);
		return data.points;
	}
}
