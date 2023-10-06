import { type HelixPaginatedResponseWithTotal } from '@twurple/api-call';
import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixEventSubDropEntitlementGrantFilter } from './eventSub.input';

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

/** @internal */
export function createEventSubBroadcasterCondition(broadcaster: UserIdResolvable) {
	return {
		broadcaster_user_id: extractUserId(broadcaster),
	};
}

/** @internal */
export function createEventSubRewardCondition(broadcaster: UserIdResolvable, rewardId: string) {
	return { broadcaster_user_id: extractUserId(broadcaster), reward_id: rewardId };
}

/** @internal */
export function createEventSubModeratorCondition(broadcasterId: string, moderatorId: string) {
	return {
		broadcaster_user_id: broadcasterId,
		moderator_user_id: moderatorId,
	};
}

/** @internal */
export function createEventSubDropEntitlementGrantCondition(
	filter: HelixEventSubDropEntitlementGrantFilter,
): Record<string, string | undefined> {
	return {
		organization_id: filter.organizationId,
		category_id: filter.categoryId,
		campaign_id: filter.campaignId,
	};
}
