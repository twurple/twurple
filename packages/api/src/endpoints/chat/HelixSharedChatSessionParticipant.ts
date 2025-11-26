import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixSharedChatSessionParticipantData } from '../../interfaces/endpoints/shared-chat-session.external.js';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixUser } from '../user/HelixUser.js';

/**
 * A shared chat session participant.
 */
@rtfm<HelixSharedChatSessionParticipant>('api', 'HelixSharedChatSessionParticipant', 'broadcasterId')
export class HelixSharedChatSessionParticipant extends DataObject<HelixSharedChatSessionParticipantData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixSharedChatSessionParticipantData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the participant broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * Gets information about the participant broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}
}
