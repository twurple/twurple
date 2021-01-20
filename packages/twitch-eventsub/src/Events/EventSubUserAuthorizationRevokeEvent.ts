import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

/** @private */
export interface EventSubUserAuthorizationRevokeEventData {
	client_id: string;
	user_id: string;
	user_login: string | null;
	user_name: string | null;
}
/**
 * An EventSub event representing a user revoking authorization for an application.
 */
@rtfm<EventSubUserAuthorizationRevokeEvent>('twitch-eventsub', 'EventSubUserAuthorizationRevokeEvent', 'userId')
export class EventSubUserAuthorizationRevokeEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubUserAuthorizationRevokeEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the user who revoked their authorization.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the user who revoked their authorization.
	 *
	 * This is `null` if the user no longer exists.
	 */
	get userName(): string | null {
		return this._data.user_login;
	}

	/**
	 * The display name of the user who revoked their authorization.
	 *
	 * This is `null` if the user no longer exists.
	 */
	get userDisplayName(): string | null {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id))!;
	}

	/**
	 * The Client ID of the application that the user revoked authorization for.
	 */
	get clientId(): string {
		return this._data.client_id;
	}
}
