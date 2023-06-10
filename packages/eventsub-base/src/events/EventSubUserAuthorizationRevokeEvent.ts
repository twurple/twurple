import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubUserAuthorizationRevokeEventData } from './EventSubUserAuthorizationRevokeEvent.external';

/**
 * An EventSub event representing a user revoking authorization for an application.
 */
@rtfm<EventSubUserAuthorizationRevokeEvent>('eventsub-base', 'EventSubUserAuthorizationRevokeEvent', 'userId')
export class EventSubUserAuthorizationRevokeEvent extends DataObject<EventSubUserAuthorizationRevokeEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
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
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		if (this[rawDataSymbol].user_login == null) {
			return null;
		}
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The Client ID of the application that the user revoked authorization for.
	 */
	get clientId(): string {
		return this[rawDataSymbol].client_id;
	}
}
