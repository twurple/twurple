import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixUnbanRequestData } from '../../interfaces/endpoints/moderation.external';
import { Enumerable, mapNullable } from '@d-fischer/shared-utils';
import type { BaseApiClient } from '../../client/BaseApiClient';
import type { HelixUser } from '../user/HelixUser';

/**
 * A request from a user to be unbanned from a channel.
 */
@rtfm<HelixUnbanRequest>('api', 'HelixUnbanRequest', 'id')
export class HelixUnbanRequest extends DataObject<HelixUnbanRequestData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixUnbanRequestData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * Unban request ID.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster whose channel is receiving the unban request.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster whose channel is receiving the unban request.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The display name of the broadcaster whose channel is receiving the unban request.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The ID of the moderator who resolved the unban request.
	 *
	 * Can be `null` if the request is not resolved.
	 */
	get moderatorId(): string | null {
		return this[rawDataSymbol].moderator_id;
	}

	/**
	 * The name of the moderator who resolved the unban request.
	 *
	 * Can be `null` if the request is not resolved.
	 */
	get moderatorName(): string | null {
		return this[rawDataSymbol].moderator_login;
	}

	/**
	 * The display name of the moderator who resolved the unban request.
	 *
	 * Can be `null` if the request is not resolved.
	 */
	get moderatorDisplayName(): string | null {
		return this[rawDataSymbol].moderator_name;
	}

	/**
	 * Gets more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].moderator_id));
	}

	/**
	 * The ID of the user who requested to be unbanned.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user who requested to be unbanned.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user who requested to be unbanned.
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
	 * Text message of the unban request from the requesting user.
	 */
	get message(): string {
		return this[rawDataSymbol].text;
	}

	/**
	 * The date of when the unban request was created.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The message written by the moderator who resolved the unban request, or `null` if it has not been resolved yet.
	 */
	get resolutionMessage(): string | null {
		// Can be empty string and null
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		return this[rawDataSymbol].resolution_text || null;
	}

	/**
	 * The date when the unban request was resolved, or `null` if it has not been resolved yet.
 	 */
	get resolutionDate(): Date | null {
		return mapNullable(this[rawDataSymbol].resolved_at, val => new Date(val));
	}
}
