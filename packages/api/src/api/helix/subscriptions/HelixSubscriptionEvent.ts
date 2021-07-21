import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixEventData } from '../HelixEvent';
import type { HelixUser } from '../user/HelixUser';
import type { HelixSubscriptionData } from './HelixSubscription';

/**
 * The different types a subscription event can have.
 */
export type HelixSubscriptionEventType =
	| 'subscriptions.subscribe'
	| 'subscriptions.unsubscribe'
	| 'subscriptions.notification';

/** @private */
export type HelixSubscriptionEventData = HelixEventData<HelixSubscriptionData, HelixSubscriptionEventType>;

/**
 * An event that indicates the change of a subscription status, i.e. subscribing, unsubscribing or sending the monthly notification.
 */
@rtfm<HelixSubscriptionEvent>('api', 'HelixSubscriptionEvent', 'userId')
export class HelixSubscriptionEvent extends DataObject<HelixSubscriptionEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(eventData: HelixSubscriptionEventData, client: ApiClient) {
		super(eventData);
		this._client = client;
	}

	/**
	 * The unique ID of the subscription event.
	 */
	get eventId(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The type of the subscription event.
	 */
	get eventType(): HelixSubscriptionEventType {
		return this[rawDataSymbol].event_type;
	}

	/**
	 * The date of the subscription event.
	 */
	get eventDate(): Date {
		return new Date(this[rawDataSymbol].event_timestamp);
	}

	/**
	 * The version of the subscription event.
	 */
	get eventVersion(): string {
		return this[rawDataSymbol].version;
	}

	/**
	 * The message sent with the subscription event.
	 */
	get eventMessage(): string {
		return this[rawDataSymbol].event_data.message ?? '';
	}

	/**
	 * Whether the subscription has been gifted by another user.
	 */
	get isGift(): boolean {
		return this[rawDataSymbol].event_data.is_gift;
	}

	/**
	 * The tier of the subscription.
	 */
	get tier(): string {
		return this[rawDataSymbol].event_data.tier;
	}

	/**
	 * The user ID of the gifter.
	 */
	get gifterId(): string {
		return this[rawDataSymbol].event_data.gifter_id;
	}

	/**
	 * The name of the gifter.
	 */
	get gifterName(): string {
		return this[rawDataSymbol].event_data.gifter_login;
	}

	/**
	 * The display name of the gifter.
	 */
	get gifterDisplayName(): string {
		return this[rawDataSymbol].event_data.gifter_name;
	}

	/**
	 * Retrieves more information about the gifter.
	 */
	async getGifter(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].event_data.gifter_id))!;
	}

	/**
	 * The user ID of the subscribed user.
	 */
	get userId(): string {
		return this[rawDataSymbol].event_data.user_id;
	}

	/**
	 * The name of the subscribed user.
	 */
	get userName(): string {
		return this[rawDataSymbol].event_data.user_login;
	}

	/**
	 * The display name of the subscribed user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].event_data.user_name;
	}

	/**
	 * Retrieves more information about the subscribed user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].event_data.user_id))!;
	}
}
