import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type ApiClient, type HelixUser } from '@twurple/api';
import { type EventSubChannelSharedChatSessionParticipantData } from './EventSubChannelSharedChatSessionParticipant.external.js';

/**
 * Represents a broadcaster participating in a shared chat session.
 */
@rtfm<EventSubChannelSharedChatSessionParticipant>(
	'eventsub-base',
	'EventSubChannelSharedChatSessionParticipant',
	'broadcasterId',
)
export class EventSubChannelSharedChatSessionParticipant extends DataObject<EventSubChannelSharedChatSessionParticipantData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelSharedChatSessionParticipantData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the participant broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the participant broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the participant broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets information about the participant broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}
}
