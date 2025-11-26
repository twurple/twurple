import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubAutoModLevel } from './common/EventSubAutoModLevel.js';
import { type EventSubAutoModMessagePart } from './common/EventSubAutoModMessage.external.js';
import { type EventSubAutoModMessageUpdateEventData } from './EventSubAutoModMessageUpdateEvent.external.js';
import { type EventSubAutoModResolutionStatus } from './common/EventSubAutoModResolutionStatus.js';

/**
 * An EventSub event representing a held chat message by AutoMod being resolved in a channel.
 */
@rtfm<EventSubAutoModMessageUpdateEvent>('eventsub-base', 'EventSubAutoModMessageUpdateEvent', 'messageId')
export class EventSubAutoModMessageUpdateEvent extends DataObject<EventSubAutoModMessageUpdateEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubAutoModMessageUpdateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster in whose channel the held message was resolved.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in whose channel the held message was resolved.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in channel the held message was resolved.
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
	 * The ID of the moderator who resolved the held message.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the moderator who resolved the held message.
	 */
	get moderatorName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the moderator who resolved the held message.
	 */
	get moderatorDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].moderator_user_id));
	}

	/**
	 * The ID of the user whose message was held by AutoMod.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user whose message was held by AutoMod.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user whose message was held by AutoMod.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The ID of the message held by AutoMod.
	 */
	get messageId(): string {
		return this[rawDataSymbol].message_id;
	}

	/**
	 * The plain text of the message.
	 */
	get messageText(): string {
		return this[rawDataSymbol].message.text;
	}

	/**
	 * The pre-parsed message parts.
	 */
	get messageParts(): EventSubAutoModMessagePart[] {
		return this[rawDataSymbol].message.fragments;
	}

	/**
	 * The category of the message.
	 */
	get category(): string {
		return this[rawDataSymbol].category;
	}

	/**
	 * The level of severity.
	 */
	get level(): EventSubAutoModLevel {
		return this[rawDataSymbol].level;
	}

	/**
	 * The status of the resolved message.
	 */
	get status(): EventSubAutoModResolutionStatus {
		return this[rawDataSymbol].status;
	}

	/**
	 * The date of when AutoMod held the message.
	 */
	get holdDate(): Date {
		return new Date(this[rawDataSymbol].held_at);
	}
}
