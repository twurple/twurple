import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubUserWhisperMessageEventData } from './EventSubUserWhisperMessageEvent.external';

/**
 * An EventSub event representing a user receiving a whisper message from another user.
 */
@rtfm<EventSubUserWhisperMessageEvent>('eventsub-base', 'EventSubUserWhisperMessageEvent', 'id')
export class EventSubUserWhisperMessageEvent extends DataObject<EventSubUserWhisperMessageEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubUserWhisperMessageEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the whisper message.
	 */
	get id(): string {
		return this[rawDataSymbol].whisper_id;
	}

	/**
	 * The ID of the user received the whisper message.
	 */
	get userId(): string {
		return this[rawDataSymbol].to_user_id;
	}

	/**
	 * The name of the user received the whisper message.
	 */
	get userName(): string {
		return this[rawDataSymbol].to_user_login;
	}

	/**
	 * The display name of the user received the whisper message.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].to_user_name;
	}

	/**
	 * Gets more information about the user received the whisper message.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].to_user_id));
	}

	/**
	 * The ID of the user sent the whisper message.
	 */
	get senderUserId(): string {
		return this[rawDataSymbol].from_user_id;
	}

	/**
	 * The name of the user sent the whisper message.
	 */
	get senderUserName(): string {
		return this[rawDataSymbol].from_user_login;
	}

	/**
	 * The display name of the user sent the whisper message.
	 */
	get senderUserDisplayName(): string {
		return this[rawDataSymbol].from_user_name;
	}

	/**
	 * Gets more information about the user sent the whisper message.
	 */
	async getSenderUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].from_user_id));
	}

	/**
	 * The text of the whisper message.
	 */
	get messageText(): string {
		return this[rawDataSymbol].whisper.text;
	}
}
