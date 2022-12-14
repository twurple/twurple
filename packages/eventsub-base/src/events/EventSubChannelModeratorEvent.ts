import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelModeratorEventData } from './EventSubChannelModeratorEvent.external';

/**
 * An EventSub event representing a broadcaster adding or removing a moderator in their channel.
 */
@rtfm<EventSubChannelModeratorEvent>('eventsub-base', 'EventSubChannelModeratorEvent', 'userId')
export class EventSubChannelModeratorEvent extends DataObject<EventSubChannelModeratorEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelModeratorEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster that added or removed a moderator.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster that added or removed a moderator.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster that added or removed a moderator.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the user that was added or removed as a moderator.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user that was added or removed as a moderator.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user that was added or removed as a moderator.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}
}
