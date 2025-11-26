import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubAutoModMessageHoldEventData } from './EventSubAutoModMessageHoldEvent.external.js';
import { type EventSubAutoModLevel } from './common/EventSubAutoModLevel.js';
import { type EventSubAutoModMessagePart } from './common/EventSubAutoModMessage.external.js';

/**
 * An EventSub event representing chat message being held by AutoMod in a channel.
 */
@rtfm<EventSubAutoModMessageHoldEvent>('eventsub-base', 'EventSubAutoModMessageHoldEvent', 'messageId')
export class EventSubAutoModMessageHoldEvent extends DataObject<EventSubAutoModMessageHoldEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubAutoModMessageHoldEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster in whose channel the message has been held by AutoMod.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in whose channel the message has been held by AutoMod.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in whose channel the message has been held by AutoMod.
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
	 * The ID of the user whose message has been held by AutoMod.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user whose message has been held by AutoMod.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user whose message has been held by AutoMod.
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
	 * The ID of the chat message held by AutoMod.
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
	 * The date of when AutoMod held the message.
	 */
	get holdDate(): Date {
		return new Date(this[rawDataSymbol].held_at);
	}
}
