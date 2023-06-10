import { type HelixPaginatedResponseWithTotal } from '@twurple/api-call';
import { extractUserId, type UserIdResolvable } from '@twurple/common';

/** @private */
export interface HelixUserSubscriptionData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	is_gift: boolean;
	tier: string;
}

/** @private */
export interface HelixSubscriptionData extends HelixUserSubscriptionData {
	gifter_id: string;
	gifter_login: string;
	gifter_name: string;
	plan_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	message?: string;
}

/** @private */
export interface HelixPaginatedSubscriptionsResponse extends HelixPaginatedResponseWithTotal<HelixSubscriptionData> {
	points: number;
}

/** @internal */
export function createSubscriptionCheckQuery(broadcaster: UserIdResolvable, user: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		user_id: extractUserId(user)
	};
}
