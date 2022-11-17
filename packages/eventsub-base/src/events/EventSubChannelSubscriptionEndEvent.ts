import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/**
 * The tier of a subscription. 1000 means tier 1, and so on.
 */
export type EventSubChannelSubscriptionEndEventTier = '1000' | '2000' | '3000';

/** @private */
export interface EventSubChannelSubscriptionEndEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	tier: EventSubChannelSubscriptionEndEventTier;
	is_gift: boolean;
}

/**
 * An EventSub event representing the end of a channel subscription.
 */
@rtfm<EventSubChannelSubscriptionEndEvent>('eventsub-base', 'EventSubChannelSubscriptionEndEvent', 'userId')
export class EventSubChannelSubscriptionEndEvent extends DataObject<EventSubChannelSubscriptionEndEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelSubscriptionEndEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user whose subscription is ending.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user whose subscription is ending.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user whose subscription is ending.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the user whose subscription is ending.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id))!;
	}

	/**
	 * The tier of the subscription, either 1000, 2000 or 3000.
	 */
	get tier(): EventSubChannelSubscriptionEndEventTier {
		return this[rawDataSymbol].tier;
	}

	/**
	 * Whether the subscription has been gifted.
	 */
	get isGift(): boolean {
		return this[rawDataSymbol].is_gift;
	}
}
