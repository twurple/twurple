import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixStream, HelixUser } from '@twurple/api';
import { rtfm } from '@twurple/common';

/**
 * The type of the stream going live.
 */
export type EventSubStreamOnlineEventStreamType = 'live' | 'playlist' | 'watch_party' | 'premiere' | 'rerun';

/** @private */
export interface EventSubStreamOnlineEventData {
	id: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	type: EventSubStreamOnlineEventStreamType;
	started_at: string;
}

/**
 * An EventSub event representing a stream going live.
 */
@rtfm<EventSubStreamOnlineEvent>('eventsub', 'EventSubStreamOnlineEvent', 'broadcasterId')
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
	 * Retrieves more information about the stream.
	 */
	async getStream(): Promise<HelixStream> {
		return (await this._client.helix.streams.getStreamByUserId(this._data.broadcaster_user_id))!;
	}

	/**
	 * The type of the stream going live.
	 */
	get streamType(): EventSubStreamOnlineEventStreamType {
		return this._data.type;
	}

	/**
	 * The date and time when the stream was started.
	 */
	get startDate(): Date {
		return new Date(this._data.started_at);
	}
}
