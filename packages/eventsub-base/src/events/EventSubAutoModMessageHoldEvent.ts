import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubAutoModMessageHoldEventData } from './EventSubAutoModMessageHoldEvent.external';
import { type EventSubAutoModMessagePart } from './common/EventSubAutoModMessage.external';
import { type EventSubAutoModMessageHoldReason } from './common/EventSubAutoModMessageHoldReason';
import { EventSubAutoModMessageAutoMod } from './common/EventSubAutoModMessageAutoMod';
import { EventSubAutoModMessageBlockedTerm } from './common/EventSubAutoModMessageBlockedTerm';

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
	 * The reason why the message was caught.
	 */
	get reason(): EventSubAutoModMessageHoldReason {
		return this[rawDataSymbol].reason;
	}

	/**
	 * The AutoMod violation data if the message was caught by AutoMod.
	 *
	 * This is only relevant if {@link EventSubAutoModMessageHoldEvent#reason} is `automod`, otherwise it is `null`.
	 */
	get autoMod(): EventSubAutoModMessageAutoMod | null {
		return this[rawDataSymbol].automod
			? new EventSubAutoModMessageAutoMod(this[rawDataSymbol].automod, this.messageText)
			: null;
	}

	/**
	 * The list of blocked terms caused the message to be caught.
	 *
	 * This is only relevant if {@link EventSubAutoModMessageHoldEvent#reason} is `blocked_term`, otherwise it is
	 * `null`.
	 */
	get blockedTerms(): EventSubAutoModMessageBlockedTerm[] | null {
		return this[rawDataSymbol].blocked_term
			? this[rawDataSymbol].blocked_term.terms_found.map(
					term => new EventSubAutoModMessageBlockedTerm(term, this.messageText),
			  )
			: null;
	}

	/**
	 * The date of when AutoMod held the message.
	 */
	get holdDate(): Date {
		return new Date(this[rawDataSymbol].held_at);
	}
}
