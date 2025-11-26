import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixChannelEditorData } from '../../interfaces/endpoints/channel.external.js';
import type { HelixUser } from '../user/HelixUser.js';

/**
 * An editor of a previously given channel.
 */
@rtfm<HelixChannelEditor>('api', 'HelixChannelEditor', 'userId')
export class HelixChannelEditor extends DataObject<HelixChannelEditorData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixChannelEditorData, client: BaseApiClient) {
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
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets additional information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The date when the user was given editor status.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}
}
