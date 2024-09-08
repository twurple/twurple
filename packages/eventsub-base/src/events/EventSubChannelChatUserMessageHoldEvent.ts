import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubAutoModMessagePart } from './common/EventSubAutoModMessage.external';
import { type EventSubChannelChatUserMessageHoldEventData } from './EventSubChannelChatUserMessageHoldEvent.external';

/**
 * An EventSub event representing a user's notification about their chat message is being held by AutoMod.
 */
@rtfm<EventSubChannelChatUserMessageHoldEvent>('eventsub-base', 'EventSubChannelChatUserMessageHoldEvent', 'messageId')
export class EventSubChannelChatUserMessageHoldEvent extends DataObject<EventSubChannelChatUserMessageHoldEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelChatUserMessageHoldEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster in whose chat AutoMod held the message.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in whose chat AutoMod held the message.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in whose chat AutoMod held the message.
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
	 * The ID of the user whose message is being held by AutoMod.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user whose message is being held by AutoMod.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user whose message is being held by AutoMod.
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
}
