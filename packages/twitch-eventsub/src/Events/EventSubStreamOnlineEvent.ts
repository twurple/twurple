import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

type EventSubStreamOnlineEventStreamType = 'live' | 'playlist' | 'watch_party' | 'premiere' | 'rerun';

/** @private */
export interface EventSubStreamOnlineEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: EventSubStreamOnlineEventStreamType;
}

/**
 * An EventSub event representing a stream going live.
 */
@rtfm<EventSubStreamOnlineEvent>('twitch-eventsub', 'EventSubStreamOnlineEvent', 'broadcasterId')
export class EventSubStreamOnlineEvent {
	@Enumerable(false) private readonly _data: EventSubStreamOnlineEventData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubStreamOnlineEventData, client: ApiClient) {
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
	 * The type of the stream going live.
	 */
	get streamType(): EventSubStreamOnlineEventStreamType {
		return this._data.type;
	}
}
