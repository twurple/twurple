import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixSharedChatSessionData } from '../../interfaces/endpoints/shared-chat-session.external.js';
import { type BaseApiClient } from '../../client/BaseApiClient.js';
import { type HelixUser } from '../user/HelixUser.js';
import { HelixSharedChatSessionParticipant } from './HelixSharedChatSessionParticipant.js';

/**
 * A shared chat session.
 */
@rtfm<HelixSharedChatSession>('api', 'HelixSharedChatSession', 'sessionId')
export class HelixSharedChatSession extends DataObject<HelixSharedChatSessionData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixSharedChatSessionData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The unique identifier for the shared chat session.
	 */
	get sessionId(): string {
		return this[rawDataSymbol].session_id;
	}

	/**
	 * The ID of the host broadcaster.
	 */
	get hostBroadcasterId(): string {
		return this[rawDataSymbol].host_broadcaster_id;
	}

	/**
	 * Gets information about the host broadcaster.
	 */
	async getHostBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].host_broadcaster_id));
	}

	/**
	 * The list of participants in the session.
	 */
	get participants(): HelixSharedChatSessionParticipant[] {
		return this[rawDataSymbol].participants.map(data => new HelixSharedChatSessionParticipant(data, this._client));
	}

	/**
	 * The date for when the session was created.
	 */
	get createdDate(): Date {
		return new Date(this[rawDataSymbol].created_at);
	}

	/**
	 * The date for when the session was updated.
	 */
	get updatedDate(): Date {
		return new Date(this[rawDataSymbol].updated_at);
	}
}
