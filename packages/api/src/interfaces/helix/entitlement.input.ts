import { type UserIdResolvable } from '@twurple/common';
import { type HelixPagination } from '../../api/helix/HelixPagination';
import { type HelixDropsEntitlementFulfillmentStatus } from './entitlement.external';

/**
 * Filters for drops entitlement queries.
 */
export interface HelixDropsEntitlementFilter {
	/**
	 * The user to find entitlements for.
	 */
	user: UserIdResolvable;

	/**
	 * The ID of the game to find entitlements for.
	 */
	gameId: string;

	/**
	 * The fulfillment status to find entitlements for.
	 */
	fulfillmentStatus: HelixDropsEntitlementFulfillmentStatus;
}

/**
 * @inheritDoc
 */
export interface HelixDropsEntitlementPaginatedFilter extends HelixDropsEntitlementFilter, HelixPagination {}
