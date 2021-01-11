import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

/** @private */
export interface EventSubStreamOfflineEventData {
	broadcaster_user_id: string;
	broadcaster_user_name: string;
}

/**
 * An EventSub event representing a stream going offline.
 */
@rtfm<EventSubStreamOfflineEvent>('twitch-eventsub', 'EventSubStreamOfflineEvent', 'broadcasterId')
export class EventSubStreamOfflineEvent {
	@Enumerable(false) private readonly _data: EventSubStreamOfflineEventData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubStreamOfflineEventData, client: ApiClient) {
		this._data = data;
		this._client = client;
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
