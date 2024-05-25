import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelUnbanRequestCreateEventData } from './EventSubChannelUnbanRequestCreateEvent.external';

/**
 * An EventSub event representing a broadcaster shouting out another broadcaster.
 */
@rtfm<EventSubChannelUnbanRequestCreateEvent>('eventsub-base', 'EventSubChannelUnbanRequestCreateEvent', 'id')
export class EventSubChannelUnbanRequestCreateEvent extends DataObject<EventSubChannelUnbanRequestCreateEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelUnbanRequestCreateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the unban request.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster the unban request was created for.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster the unban request was created for.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster the unban request was created for.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster in which channel the unban request was created for.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the user that is requesting to be unbanned.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user that is requesting to be unbanned.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user that is requesting to be unbanned.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user that requested to be unbanned.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The message sent in the unban request.
	 */
	get message(): string {
		return this[rawDataSymbol].text;
	}

	/**
	 * Date when the unban request was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}
}
