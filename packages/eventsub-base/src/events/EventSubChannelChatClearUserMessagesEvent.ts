import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelChatClearUserMessagesEventData } from './EventSubChannelChatClearUserMessagesEvent.external.js';

/**
 * An EventSub event representing a user's chat messages being cleared in a channel.
 */
@rtfm<EventSubChannelChatClearUserMessagesEvent>(
	'eventsub-base',
	'EventSubChannelChatClearUserMessagesEvent',
	'broadcasterId',
)
export class EventSubChannelChatClearUserMessagesEvent extends DataObject<EventSubChannelChatClearUserMessagesEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelChatClearUserMessagesEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user whose chat messages were cleared.
	 */
	get userId(): string {
		return this[rawDataSymbol].target_user_id;
	}

	/**
	 * The name of the user whose chat messages were cleared.
	 */
	get userName(): string {
		return this[rawDataSymbol].target_user_login;
	}

	/**
	 * The display name of the user whose chat messages were cleared.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].target_user_name;
	}

	/**
	 * Gets more information about the user whose chat messages were cleared.
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
}
