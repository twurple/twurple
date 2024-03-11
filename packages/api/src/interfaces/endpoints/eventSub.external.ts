import { type HelixPaginatedResponseWithTotal } from '@twurple/api-call';
import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixEventSubDropEntitlementGrantFilter, type HelixEventSubConduitShardsOptions } from './eventSub.input';

export type HelixEventSubSubscriptionStatus =
	| 'enabled'
	| 'webhook_callback_verification_pending'
	| 'webhook_callback_verification_failed'
	| 'notification_failures_exceeded'
	| 'authorization_revoked'
	| 'moderator_removed'
	| 'user_removed'
	| 'version_removed'
	| 'beta_maintenance'
	| 'websocket_disconnected'
	| 'websocket_failed_ping_pong'
	| 'websocket_received_inbound_traffic'
	| 'websocket_connection_unused'
	| 'websocket_internal_error'
	| 'websocket_network_timeout'
	| 'websocket_network_error'
	| 'conduit_deleted';

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
	 * The session ID of the websocket.
	 */
	session_id: string;

	/**
	 * The time when the client initiated the socket connection.
	 */
	connected_at: string;

	/**
	 * The time when the socket connection was lost.
	 */
	disconnected_at: string;
}

/** @private */
export interface HelixEventSubConduitTransportData {
	/**
	 * The type of transport.
	 */
	method: 'conduit';

	/**
	 * The conduit ID.
	 */
	conduit_id: string;
}

/** @private */
export interface HelixEventSubConduitData {
	/**
	 * The conduit ID.
	 */
	id: string;
	/**
	 * The shard count.
	 */
	shard_count: number;
}

/** @private */
export interface HelixEventSubConduitShardData {
	/**
	 * The shard ID.
	 */
	id: string;
	/**
	 * The shard status.
	 */
	status: HelixEventSubSubscriptionStatus;
	/**
	 * The transport method.
	 */
	transport: HelixEventSubWebHookTransportData | HelixEventSubWebSocketTransportData;
}

/** @private */
export type HelixEventSubTransportData =
	| HelixEventSubWebHookTransportData
	| HelixEventSubWebSocketTransportData
	| HelixEventSubConduitTransportData;

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
export function createEventSubUserCondition(broadcasterId: string, userId: string) {
	return {
		broadcaster_user_id: broadcasterId,
		user_id: userId,
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

/** @internal */
export function createEventSubConduitCondition(
	conduitId: string,
	status: string | undefined,
): Record<string, string | undefined> {
	return {
		conduit_id: conduitId,
		status,
	};
}

/** @internal */
export function createEventSubConduitUpdateCondition(conduitId: string, shardCount: number): Record<string, string> {
	return {
		id: conduitId,
		shard_count: shardCount.toString(),
	};
}

/** @internal */
export function createEventSubConduitShardsUpdateCondition(
	conduitId: string,
	shards: HelixEventSubConduitShardsOptions[],
): Record<string, unknown> {
	return {
		conduit_id: conduitId,
		shards,
	};
}
