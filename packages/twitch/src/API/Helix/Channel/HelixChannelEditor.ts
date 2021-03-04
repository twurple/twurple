import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/** @private */
export interface HelixChannelEditorData {
	user_id: string;
	user_name: string;
	created_at: string;
}

/**
 * An editor of a previously given channel.
 */
@rtfm<HelixChannelEditor>('twitch', 'HelixChannelEditor', 'userId')
export class HelixChannelEditor {
	@Enumerable(false) private readonly _data: HelixChannelEditorData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixChannelEditorData, client: ApiClient) {
		this._data = data;
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
	 * Retrieves additional information about the user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	/**
	 * The date when the user was given editor status.
	 */
	get creationDate(): Date {
		return new Date(this._data.created_at);
	}
}
