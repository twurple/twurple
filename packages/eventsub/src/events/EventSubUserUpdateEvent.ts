import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface EventSubUserUpdateEventData {
	user_id: string;
	user_login: string;
	user_name: string;
	email?: string;
	description: string;
}

/**
 * An EventSub event representing updating their account details.
 */
@rtfm<EventSubUserUpdateEvent>('eventsub', 'EventSubUserUpdateEvent', 'userId')
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
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
