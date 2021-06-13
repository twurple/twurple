import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

/** @private */
export interface EventSubChannelSubscriptionEndEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
}

/**
 * An EventSub event representing the end of a channel subscription.
 */
@rtfm<EventSubChannelSubscriptionEndEvent>('twitch-eventsub', 'EventSubChannelSubscriptionEndEvent', 'userId')
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
}
