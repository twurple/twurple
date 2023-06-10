import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubStreamOfflineEventData } from './EventSubStreamOfflineEvent.external';

/**
 * An EventSub event representing a stream going offline.
 */
@rtfm<EventSubStreamOfflineEvent>('eventsub-base', 'EventSubStreamOfflineEvent', 'broadcasterId')
export class EventSubStreamOfflineEvent extends DataObject<EventSubStreamOfflineEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubStreamOfflineEventData, client: ApiClient) {
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
}
