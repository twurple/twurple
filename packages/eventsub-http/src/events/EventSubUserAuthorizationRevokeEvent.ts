import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

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
@rtfm<EventSubUserAuthorizationRevokeEvent>('eventsub', 'EventSubUserAuthorizationRevokeEvent', 'userId')
export class EventSubUserAuthorizationRevokeEvent extends DataObject<EventSubUserAuthorizationRevokeEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubUserAuthorizationRevokeEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user who revoked their authorization.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user who revoked their authorization.
	 *
	 * This is `null` if the user no longer exists.
	 */
	get userName(): string | null {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user who revoked their authorization.
	 *
	 * This is `null` if the user no longer exists.
	 */
	get userDisplayName(): string | null {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The Client ID of the application that the user revoked authorization for.
	 */
	get clientId(): string {
		return this[rawDataSymbol].client_id;
	}
}
