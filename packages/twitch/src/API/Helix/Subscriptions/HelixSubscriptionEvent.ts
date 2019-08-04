import HelixSubscription, { HelixSubscriptionData } from './HelixSubscription';
import TwitchClient from '../../../TwitchClient';

export enum HelixSubscriptionEventType {
  Subscribe = "subscriptions.subscribe",
  Unsubscribe = "subscriptions.unsubscribe",
  Notification = "subscriptions.notification"
}

/** @private */
export interface HelixSubscriptionEventData {
	id: string,
  event_type: HelixSubscriptionEventType,
  event_timestamp: string,
  version: string,
  event_data: HelixSubscriptionData
}

export default class HelixSubscriptionEvent extends HelixSubscription {
  /** @private */
  constructor(private readonly _event_data: HelixSubscriptionEventData, client: TwitchClient) {
    super(_event_data.event_data, client);
  }

  /**
	 * The unique ID of the subscription event.
	 */
  get eventId() {
    return this._event_data.id;
  }

  /**
	 * The type of the subscription event.
	 */
  get eventType() {
    return this._event_data.event_type;
  }

  /**
	 * The date of the subscription event.
	 */
  get eventDate() {
    return new Date(this._event_data.event_timestamp);
  }

  /**
	 * The version of the subscription event.
	 */
  get eventVersion() {
    return this._event_data.version;
  }
}
