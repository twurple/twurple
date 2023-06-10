import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubUserAuthorizationGrantEventData } from './EventSubUserAuthorizationGrantEvent.external';

/**
 * An EventSub event representing a user revoking authorization for an application.
 */
@rtfm<EventSubUserAuthorizationGrantEvent>('eventsub-base', 'EventSubUserAuthorizationGrantEvent', 'userId')
export class EventSubUserAuthorizationGrantEvent extends DataObject<EventSubUserAuthorizationGrantEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubUserAuthorizationGrantEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the user who granted the authorization.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user who granted the authorization.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user who granted the authorization.
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
	 * The Client ID of the application that the user granted authorization to.
	 */
	get clientId(): string {
		return this[rawDataSymbol].client_id;
	}
}
