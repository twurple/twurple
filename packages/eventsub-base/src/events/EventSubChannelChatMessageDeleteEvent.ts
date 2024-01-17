import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelChatMessageDeleteEventData } from './EventSubChannelChatMessageDeleteEvent.external';

/**
 * An EventSub event representing a chat message being deleted in a channel.
 */
@rtfm<EventSubChannelChatMessageDeleteEvent>('eventsub-base', 'EventSubChannelChatMessageDeleteEvent', 'broadcasterId')
export class EventSubChannelChatMessageDeleteEvent extends DataObject<EventSubChannelChatMessageDeleteEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelChatMessageDeleteEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user whose chat message was deleted.
	 */
	get userId(): string {
		return this[rawDataSymbol].target_user_id;
	}

	/**
	 * The name of the user whose chat message was deleted.
	 */
	get userName(): string {
		return this[rawDataSymbol].target_user_login;
	}

	/**
	 * The display name of the user whose chat message was deleted.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].target_user_name;
	}

	/**
	 * Gets more information about the user whose chat message was deleted.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].target_user_id));
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
	 * The ID of the message that was deleted.
	 */
	get messageId(): string {
		return this[rawDataSymbol].message_id;
	}
}
