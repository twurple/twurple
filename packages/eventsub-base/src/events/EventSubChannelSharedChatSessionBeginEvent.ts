import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient, HelixUser } from '@twurple/api';
import { type EventSubChannelSharedChatSessionBeginEventData } from './EventSubChannelSharedChatSessionBeginEvent.external';
import { EventSubChannelSharedChatSessionParticipant } from './common/EventSubChannelSharedChatSessionParticipant';

/**
 * An EventSub event representing the start of a shared chat session in a channel.
 */
@rtfm<EventSubChannelSharedChatSessionBeginEvent>(
	'eventsub-base',
	'EventSubChannelSharedChatSessionBeginEvent',
	'broadcasterId',
)
export class EventSubChannelSharedChatSessionBeginEvent extends DataObject<EventSubChannelSharedChatSessionBeginEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelSharedChatSessionBeginEventData, client: ApiClient) {
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
	 * The list of all participants currently in the shared chat session.
	 */
	get participants(): EventSubChannelSharedChatSessionParticipant[] {
		return this[rawDataSymbol].participants.map(
			participant => new EventSubChannelSharedChatSessionParticipant(participant, this._client),
		);
	}
}
