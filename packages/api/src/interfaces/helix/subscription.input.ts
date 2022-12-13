import { type HelixPaginatedResultWithTotal } from '../../api/helix/HelixPaginatedResult';
import { type HelixSubscription } from '../../api/helix/subscriptions/HelixSubscription';

/**
 * The result of a subscription query, including the subscription data, cursor, total count and sub points.
 */
export interface HelixPaginatedSubscriptionsResult extends HelixPaginatedResultWithTotal<HelixSubscription> {
	/**
	 * The number of sub points the broadcaster currently has.
	 */
	points: number;
}
