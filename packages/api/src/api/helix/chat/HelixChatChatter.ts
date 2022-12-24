import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../../client/BaseApiClient';
import { type HelixChatChatterData } from '../../../interfaces/helix/chat.external';
import { type HelixUser } from '../user/HelixUser';

/**
 * A user connected to a Twitch channel's chat session.
 *
 * @beta
 */
@rtfm('api', 'HelixChatChatter')
export class HelixChatChatter extends DataObject<HelixChatChatterData> {
	@Enumerable(false) private readonly _client: BaseApiClient;

	/** @private */
	constructor(data: HelixChatChatterData, client: BaseApiClient) {
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
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}
}
