import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { rtfm } from '@twurple/common';

/**
 * The tier of the subscription.
 */
export type EventSubChannelSubscriptionEventTier = '1000' | '2000' | '3000';

/** @private */
export interface EventSubChannelSubscriptionEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	tier: EventSubChannelSubscriptionEventTier;
	is_gift: boolean;
}

/**
 * An EventSub event representing a channel subscription.
 */
@rtfm<EventSubChannelSubscriptionEvent>('twitch-eventsub', 'EventSubChannelSubscriptionEvent', 'userId')
export class EventSubChannelSubscriptionEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelSubscriptionEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the subscribing user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the subscribing user.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the subscribing user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the subscription.
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
	get tier(): EventSubChannelSubscriptionEventTier {
		return this._data.tier;
	}

	/**
	 * Whether the subscription has been gifted.
	 */
	get isGift(): boolean {
		return this._data.is_gift;
	}
}
