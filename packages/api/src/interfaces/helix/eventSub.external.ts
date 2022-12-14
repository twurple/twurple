import { type HelixPaginatedResponseWithTotal } from '@twurple/api-call';
import { extractUserId, type UserIdResolvable } from '@twurple/common';

export type HelixEventSubSubscriptionStatus =
	| 'enabled'
	| 'webhook_callback_verification_pending'
	| 'webhook_callback_verification_failed'
	| 'websocket_disconnected'
	| 'notification_failures_exceeded'
	| 'authorization_revoked'
	| 'user_removed';

/** @private */
export interface HelixEventSubWebHookTransportData {
	/**
	 * The type of transport.
	 */
	method: 'webhook';

	/**
	 * The callback URL to send event notifications to.
	 */
	callback: string;
}

/** @private */
export interface HelixEventSubWebSocketTransportData {
	/**
	 * The type of transport.
	 */
	method: 'websocket';

	/**
	 * The callback URL to send event notifications to.
	 */
	session_id: string;

	/**
	 * The time when the client initiated the socket connection.
	 */
	connected_at: string;
}

/** @private */
export type HelixEventSubTransportData = HelixEventSubWebHookTransportData | HelixEventSubWebSocketTransportData;

/** @private */
export interface HelixEventSubSubscriptionData {
	id: string;
	status: HelixEventSubSubscriptionStatus;
	type: string;
	cost: number;
	version: string;
	condition: Record<string, unknown>;
	created_at: string;
	transport: HelixEventSubTransportData;
}

/** @private */
export interface HelixPaginatedEventSubSubscriptionsResponse
	extends HelixPaginatedResponseWithTotal<HelixEventSubSubscriptionData> {
	total_cost: number;
	max_total_cost: number;
}

/** @private */
export function createEventSubBroadcasterCondition(broadcaster: UserIdResolvable) {
	return {
		broadcaster_user_id: extractUserId(broadcaster)
	};
}

/** @private */
export function createEventSubRewardCondition(broadcaster: UserIdResolvable, rewardId: string) {
	return { broadcaster_user_id: extractUserId(broadcaster), reward_id: rewardId };
}

/** @private */
export function createEventSubModeratorCondition(broadcaster: UserIdResolvable, moderator: UserIdResolvable) {
	return {
		broadcaster_user_id: extractUserId(broadcaster),
		moderator_user_id: extractUserId(moderator)
	};
}
