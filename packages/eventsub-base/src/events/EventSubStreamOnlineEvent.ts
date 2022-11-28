import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixStream, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

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
@rtfm<EventSubStreamOnlineEvent>('eventsub-base', 'EventSubStreamOnlineEvent', 'broadcasterId')
export class EventSubStreamOnlineEvent extends DataObject<EventSubStreamOnlineEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubStreamOnlineEventData, client: ApiClient) {
		super(data);
		this._client = client;
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
	 * Retrieves more information about the stream.
	 */
	async getStream(): Promise<HelixStream> {
		return (await this._client.streams.getStreamByUserId(this[rawDataSymbol].broadcaster_user_id))!;
	}

	/**
	 * The ID of the stream going live.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The type of the stream going live.
	 *
	 * @deprecated Use {@link EventSubStreamOnlineEvent#type} instead.
	 */
	get streamType(): EventSubStreamOnlineEventStreamType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The type of the stream going live.
	 */
	get type(): EventSubStreamOnlineEventStreamType {
		return this[rawDataSymbol].type;
	}

	/**
	 * The date and time when the stream was started.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}
}
