import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../user/HelixUser';

/** @private */
export interface HelixChannelEditorData {
	user_id: string;
	user_name: string;
	created_at: string;
}

/**
 * An editor of a previously given channel.
 */
@rtfm<HelixChannelEditor>('api', 'HelixChannelEditor', 'userId')
export class HelixChannelEditor extends DataObject<HelixChannelEditorData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixChannelEditorData, client: ApiClient) {
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
	 * Retrieves additional information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}

	/**
	 * The date when the user was given editor status.
	 */
	get creationDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}
}
