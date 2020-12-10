import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

export interface EventSubChannelUnbanEventData {
	user_id: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_name: string;
}

/**
 * An EventSub event representing a user being unbanned in a channel.
 */
export class EventSubChannelUnbanEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	constructor(private readonly _data: EventSubChannelUnbanEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the unbanned user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The display name of the unbanned user.
	 */
	get userName(): string {
		return this._data.user_name;
	}

	/** Retrieves more information about the unbanned user */
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
