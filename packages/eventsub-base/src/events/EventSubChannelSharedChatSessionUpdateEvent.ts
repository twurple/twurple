import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient, HelixUser } from '@twurple/api';
import { EventSubChannelSharedChatSessionParticipant } from './common/EventSubChannelSharedChatSessionParticipant';
import { type EventSubChannelSharedChatSessionUpdateEventData } from './EventSubChannelSharedChatSessionUpdateEvent.external';

/**
 * An EventSub event representing an update to a shared chat session in a channel.
 */
@rtfm<EventSubChannelSharedChatSessionUpdateEvent>(
	'eventsub-base',
	'EventSubChannelSharedChatSessionUpdateEvent',
	'broadcasterId',
)
export class EventSubChannelSharedChatSessionUpdateEvent extends DataObject<EventSubChannelSharedChatSessionUpdateEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelSharedChatSessionUpdateEventData, client: ApiClient) {
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
	 * The ID of the broadcaster in the subscription condition which is now active in the shared chat session.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster in the subscription condition which is now active in the shared chat session.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster in the subscription condition which is now active in the shared chat session.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the host broadcaster.
	 */
	get hostBroadcasterId(): string {
		return this[rawDataSymbol].host_broadcaster_user_id;
	}

	/**
	 * The name of the host broadcaster.
	 */
	get hostBroadcasterName(): string {
		return this[rawDataSymbol].host_broadcaster_user_login;
	}

	/**
	 * The display name of the host broadcaster.
	 */
	get hostBroadcasterDisplayName(): string {
		return this[rawDataSymbol].host_broadcaster_user_name;
	}

	/**
	 * Gets information about the broadcaster.
	 */
	async getHostBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(
			await this._client.users.getUserById(this[rawDataSymbol].host_broadcaster_user_id),
		);
	}

	/**
	 * The list of participants in the session.
	 */
	get participants(): EventSubChannelSharedChatSessionParticipant[] {
		return this[rawDataSymbol].participants.map(
			participant => new EventSubChannelSharedChatSessionParticipant(participant, this._client),
		);
	}
}
