import { type HelixEventSubSubscription } from '../../api/helix/eventSub/HelixEventSubSubscription';
import { type HelixPaginatedResultWithTotal } from '../../api/helix/HelixPaginatedResult';
import { type HelixEventSubWebHookTransportData, type HelixEventSubWebSocketTransportData } from './eventSub.external';

/**
 * The properties describing where a WebHook notification is sent, and how it is signed.
 *
 * @inheritDoc
 */
export interface HelixEventSubWebHookTransportOptions extends HelixEventSubWebHookTransportData {
	/**
	 * The secret to sign the notification payloads with.
	 */
	secret?: string;
}

/**
 * The properties describing where a WebSocket notification is sent.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HelixEventSubWebSocketTransportOptions
	extends Omit<HelixEventSubWebSocketTransportData, 'connected_at'> {}

export type HelixEventSubTransportOptions =
	| HelixEventSubWebHookTransportOptions
	| HelixEventSubWebSocketTransportOptions;

/**
 * The result of an EventSub subscription list request.
 *
 * @inheritDoc
 */
export interface HelixPaginatedEventSubSubscriptionsResult
	extends HelixPaginatedResultWithTotal<HelixEventSubSubscription> {
	/**
	 * The total cost of all subscriptions.
	 */
	totalCost: number;

	/**
	 * The maximum cost that is allowed for your application.
	 */
	maxTotalCost: number;
}
