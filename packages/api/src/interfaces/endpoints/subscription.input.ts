import { type HelixSubscription } from '../../endpoints/subscriptions/HelixSubscription';
import { type HelixPaginatedResultWithTotal } from '../../utils/pagination/HelixPaginatedResult';

/**
 * The result of a subscription query, including the subscription data, cursor, total count and sub points.
 */
export interface HelixPaginatedSubscriptionsResult extends HelixPaginatedResultWithTotal<HelixSubscription> {
	/**
	 * The number of sub points the broadcaster currently has.
	 */
	points: number;
}
