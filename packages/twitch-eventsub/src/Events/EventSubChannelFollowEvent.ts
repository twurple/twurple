import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { rtfm } from '@twurple/common';

/** @private */
export interface EventSubChannelFollowEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	followed_at: string;
}

/**
 * An EventSub event representing a channel being followed.
 */
@rtfm<EventSubChannelFollowEvent>('twitch-eventsub', 'EventSubChannelFollowEvent', 'userId')
export class EventSubChannelFollowEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelFollowEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the following user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the following user.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the following user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the following user.
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
	 * The date when the user followed.
	 */
	get followDate(): Date {
		return new Date(this._data.followed_at);
	}
}
