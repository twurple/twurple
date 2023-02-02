import type { HelixEventSubSubscriptionStatus, HelixEventSubTransportData } from '@twurple/api';

/** @private */
export interface EventSubSubscriptionBody {
	id: string;
	status: HelixEventSubSubscriptionStatus;
	type: string;
	version: string;
	condition: Record<string, string>;
	transport: HelixEventSubTransportData;
	created_at: string;
}

/** @private */
export interface EventSubSingleNotificationPayload {
	subscription: EventSubSubscriptionBody;
	event: Record<string, unknown>;
}

/** @private */
export interface EventSubBatchNotificationPayload {
	subscription: EventSubSubscriptionBody;
	events: Array<Record<string, unknown>>;
}

/** @private */
export type EventSubNotificationPayload = EventSubSingleNotificationPayload | EventSubBatchNotificationPayload;
