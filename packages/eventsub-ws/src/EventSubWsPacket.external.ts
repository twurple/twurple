import { type EventSubNotificationPayload } from '@twurple/eventsub-base';

/** @private */
interface EventSubWsMetadata {
	message_id: string;
	message_type: string;
	message_timestamp: string;
	subscription_type: string;
	subscription_version: string;
}

type EventSubWsSessionStatus = 'connected' | 'reconnecting';

/** @private */
interface EventSubWsSession {
	id: string;
	status: EventSubWsSessionStatus;
	keepalive_timeout_seconds: number | null;
	reconnect_url: string | null;
	connected_at: string;
}

/** @private */
export interface EventSubReconnectPayload {
	session: EventSubWsSession;
}

/** @private */
export interface EventSubWelcomePayload {
	session: EventSubWsSession;
}

/** @private */
type EventSubWsPayload = EventSubNotificationPayload | EventSubReconnectPayload | EventSubWelcomePayload;

/** @private */
export interface EventSubWsPacket {
	metadata: EventSubWsMetadata;
	payload: EventSubWsPayload;
}
