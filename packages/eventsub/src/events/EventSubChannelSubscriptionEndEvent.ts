import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { rtfm } from '@twurple/common';

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
@rtfm<EventSubChannelSubscriptionEndEvent>('eventsub', 'EventSubChannelSubscriptionEndEvent', 'userId')
export class EventSubChannelSubscriptionEndEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelSubscriptionEndEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the user whose subscription is ending.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the user whose subscription is ending.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the user whose subscription is ending.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user whose subscription is ending.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id))!;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_user_id))!;
	}

	/**
	 * The tier of the subscription, either 1000, 2000 or 3000.
	 */
	get tier(): EventSubChannelSubscriptionEndEventTier {
		return this._data.tier;
	}

	/**
	 * Whether the subscription has been gifted.
	 */
	get isGift(): boolean {
		return this._data.is_gift;
	}
}
