import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';

export interface EventSubUserUpdateEventData {
	user_id: string;
	user_name: string;
	email?: string;
	description: string;
}

/**
 * An EventSub event representing updating their account details
 */
export class EventSubUserUpdateEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

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
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * The user's profile description
	 */
	get userDescription(): string {
		return this._data.description;
	}

	/**
	 * The user's email address, if authorized
	 */
	get userEmail(): string | null {
		if (this._data.email) {
			return this._data.email;
		} else {
			return null;
		}
	}

	/**
	 * Retrieves more information about the user
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id))!;
	}
}
