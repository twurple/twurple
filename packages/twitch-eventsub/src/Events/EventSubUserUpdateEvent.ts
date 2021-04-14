import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { rtfm } from '@twurple/common';

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
@rtfm<EventSubUserUpdateEvent>('twitch-eventsub', 'EventSubUserUpdateEvent', 'userId')
export class EventSubUserUpdateEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubUserUpdateEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the user.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * The user's profile description.
	 */
	get userDescription(): string {
		return this._data.description;
	}

	/**
	 * The user's email address.
	 *
	 * This is `null` if you are not authorized to read the email address,
	 * i.e. you have never successfully requested the scope `user:read:email` from the user.
	 */
	get userEmail(): string | null {
		return this._data.email ?? null;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id))!;
	}
}
