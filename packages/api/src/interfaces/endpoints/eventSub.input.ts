import { type HelixEventSubSubscription } from '../../endpoints/eventSub/HelixEventSubSubscription';
import { type HelixPaginatedResultWithTotal } from '../../utils/pagination/HelixPaginatedResult';
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

/**
 * Filters for EventSub drop entitlement grant events.
 */
export interface HelixEventSubDropEntitlementGrantFilter {
	/**
	 * The ID of the organization that owns the categories/games to get events for.
	 */
	organizationId: string;

	/**
	 * The ID of the category/game to get events for.
	 */
	categoryId?: string;

	/**
	 * The ID of the campaign to get events for.
	 */
	campaignId?: string;
}
