import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type ApiClient } from '../../../ApiClient';
import { type HelixUser } from '../user/HelixUser';

/** @private */
export interface HelixChatChatterData {
	user_id: string;
	user_login: string;
	user_name: string;
}

/**
 * A user connected to a Twitch channel's chat session.
 *
 * @beta
 */
@rtfm('api', 'HelixChatChatter')
export class HelixChatChatter extends DataObject<HelixChatChatterData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixChatChatterData, client: ApiClient) {
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
	 * The name of the user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}
	/**
	 * The display name of the user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}
	/**
	 * Retrieves more information about the user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
