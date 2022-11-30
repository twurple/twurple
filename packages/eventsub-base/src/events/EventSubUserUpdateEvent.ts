import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubUserUpdateEventData } from './EventSubUserUpdateEvent.external';

/**
 * An EventSub event representing updating their account details.
 */
@rtfm<EventSubUserUpdateEvent>('eventsub-base', 'EventSubUserUpdateEvent', 'userId')
export class EventSubUserUpdateEvent extends DataObject<EventSubUserUpdateEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubUserUpdateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * The user's profile description.
	 */
	get userDescription(): string {
		return this[rawDataSymbol].description;
	}

	/**
	 * The user's email address.
	 *
	 * This is `null` if you are not authorized to read the email address,
	 * i.e. you have never successfully requested the scope `user:read:email` from the user.
	 */
	get userEmail(): string | null {
		return this[rawDataSymbol].email ?? null;
	}

	/**
	 * Whether the user's email address has been verified by Twitch.
	 *
	 * This is `null` if you are not authorized to read the email address,
	 * i.e. you have never successfully requested the scope `user:read:email` from the user.
	 */
	get userEmailIsVerified(): boolean | null {
		return this[rawDataSymbol].email ? this[rawDataSymbol].email_verified : null;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
