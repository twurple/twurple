import { mapOptional } from '@d-fischer/shared-utils';
import { extractUserId } from '@twurple/common';
import { type HelixDropsEntitlementFilter } from './entitlement.input';

/**
 * The fulfillment status of a drop entitlement.
 */
export type HelixDropsEntitlementFulfillmentStatus = 'CLAIMED' | 'FULFILLED';

/**
 * The update status of a drop entitlement.
 */
export type HelixDropsEntitlementUpdateStatus =
	| 'INVALID_ID'
	| 'NOT_FOUND'
	| 'SUCCESS'
	| 'UNAUTHORIZED'
	| 'UPDATE_FAILED';

/** @private */
export interface HelixDropsEntitlementData {
	id: string;
	benefit_id: string;
	timestamp: string;
	user_id: string;
	game_id: string;
	fulfillment_status: HelixDropsEntitlementFulfillmentStatus;
	last_updated: string;
}

/** @private */
export interface HelixDropsEntitlementUpdateData {
	status: HelixDropsEntitlementUpdateStatus;
	ids: string[];
}

/** @internal */
export function createDropsEntitlementQuery(
	filters: HelixDropsEntitlementFilter,
	alwaysApp: boolean,
): Record<string, string | undefined> {
	return {
		user_id: alwaysApp ? mapOptional(filters.user, extractUserId) : undefined,
		game_id: filters.gameId,
		fulfillment_status: filters.fulfillmentStatus,
	};
}

/** @internal */
export function createDropsEntitlementUpdateBody(
	ids: string[],
	fulfillmentStatus: HelixDropsEntitlementFulfillmentStatus,
): Record<string, string | string[]> {
	return {
		fulfillment_status: fulfillmentStatus,
		entitlement_ids: ids,
	};
}
