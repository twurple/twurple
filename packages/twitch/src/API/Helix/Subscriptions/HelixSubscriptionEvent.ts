import HelixSubscription, { HelixSubscriptionData } from './HelixSubscription';
import TwitchClient from '../../../TwitchClient';

export enum HelixSubscriptionEventType {
	Subscribe = 'subscriptions.subscribe',
	Unsubscribe = 'subscriptions.unsubscribe',
	Notification = 'subscriptions.notification'
}

/** @private */
export interface HelixSubscriptionEventData {
	id: string;
	event_type: HelixSubscriptionEventType;
	event_timestamp: string;
	version: string;
	event_data: HelixSubscriptionData;
}

export default class HelixSubscriptionEvent extends HelixSubscription {
	/** @private */
	constructor(private readonly _eventData: HelixSubscriptionEventData, client: TwitchClient) {
		super(_eventData.event_data, client);
	}

	/**
	 * The unique ID of the subscription event.
	 */
	get eventId() {
		return this._eventData.id;
	}

	/**
	 * The type of the subscription event.
	 */
	get eventType() {
		return this._eventData.event_type;
	}

	/**
	 * The date of the subscription event.
	 */
	get eventDate() {
		return new Date(this._eventData.event_timestamp);
	}

	/**
	 * The version of the subscription event.
	 */
	get eventVersion() {
		return this._eventData.version;
	}

	get eventMessage() {
		return this._eventData.event_data.message || null;
	}
}
