import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixStream, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import {
	type EventSubStreamOnlineEventData,
	type EventSubStreamOnlineEventStreamType,
} from './EventSubStreamOnlineEvent.external';

/**
 * An EventSub event representing a stream going live.
 */
@rtfm<EventSubStreamOnlineEvent>('eventsub-base', 'EventSubStreamOnlineEvent', 'broadcasterId')
export class EventSubStreamOnlineEvent extends DataObject<EventSubStreamOnlineEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
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
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * Gets more information about the stream.
	 *
	 * This may sometimes return null, as the Helix API might be behind due to caching on Twitch's side.
	 */
	async getStream(): Promise<HelixStream | null> {
		return await this._client.streams.getStreamByUserId(this[rawDataSymbol].broadcaster_user_id);
	}

	/**
	 * The ID of the stream going live.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
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
