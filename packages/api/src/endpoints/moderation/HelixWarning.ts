import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import { type HelixWarningData } from '../../interfaces/endpoints/moderation.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * Information about the warning.
 */
@rtfm<HelixWarning>('api', 'HelixWarning', 'userId')
export class HelixWarning extends DataObject<HelixWarningData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixWarningData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the channel in which the warning will take effect.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The ID of the user who applied the warning.
	 */
	get moderatorId(): string {
		return this[rawDataSymbol].moderator_id;
	}

	/**
	 * Gets more information about the moderator.
	 */
	async getModerator(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].moderator_id));
	}

	/**
	 * The ID of the warned user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * Gets more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The reason provided for the warning.
	 */
	get reason(): string {
		return this[rawDataSymbol].reason;
	}
}
