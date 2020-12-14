import type { ApiClient } from '../../../ApiClient';
import type { HelixEventData } from '../HelixEvent';
import type { HelixSubscriptionData } from './HelixSubscription';
import { HelixSubscription } from './HelixSubscription';

/**
 * The different types a subscription event can have.
 */
export enum HelixSubscriptionEventType {
	/**
	 * Sent when a new user subscribes.
	 */
	Subscribe = 'subscriptions.subscribe',

	/**
	 * Sent when a previous subscriber stops subscribing.
	 */
	Unsubscribe = 'subscriptions.unsubscribe',

	/**
	 * Sent when a new or recurring subscriber sends their monthly notification.
	 */
	Notification = 'subscriptions.notification'
}

/** @private */
export type HelixSubscriptionEventData = HelixEventData<HelixSubscriptionData, HelixSubscriptionEventType>;

/**
 * An event that indicates the change of a subscription status, i.e. subscribing, unsubscribing or sending the monthly notification.
 */
export class HelixSubscriptionEvent extends HelixSubscription {
	/** @private */
	constructor(private readonly _eventData: HelixSubscriptionEventData, client: ApiClient) {
		super(_eventData.event_data, client);
	}

	/**
	 * The unique ID of the subscription event.
	 */
	get eventId(): string {
		return this._eventData.id;
	}

	/**
	 * The type of the subscription event.
	 */
	get eventType(): HelixSubscriptionEventType {
		return this._eventData.event_type;
	}

	/**
	 * The date of the subscription event.
	 */
	get eventDate(): Date {
		return new Date(this._eventData.event_timestamp);
	}

	/**
	 * The version of the subscription event.
	 */
	get eventVersion(): string {
		return this._eventData.version;
	}

	/**
	 * The message sent with the subscription event.
	 */
	get eventMessage(): string {
		return this._eventData.event_data.message ?? '';
	}
}
