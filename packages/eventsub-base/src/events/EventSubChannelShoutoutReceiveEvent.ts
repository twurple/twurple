import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelShoutoutReceiveEventData } from './EventSubChannelShoutoutReceiveEvent.external';

/**
 * An EventSub event representing a broadcaster being shouted out by another broadcaster.
 */
@rtfm<EventSubChannelShoutoutReceiveEvent>(
	'eventsub-base',
	'EventSubChannelShoutoutReceiveEvent',
	'shoutingOutBroadcasterId'
)
export class EventSubChannelShoutoutReceiveEvent extends DataObject<EventSubChannelShoutoutReceiveEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelShoutoutReceiveEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster who received the shoutout.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster who received the shoutout.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster who received the shoutout.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster who received the shoutout.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the broadcaster who sent the shoutout.
	 */
	get shoutingOutBroadcasterId(): string {
		return this[rawDataSymbol].from_broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster who sent the shoutout.
	 */
	get shoutingOutBroadcasterName(): string {
		return this[rawDataSymbol].from_broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster who sent the shoutout.
	 */
	get shoutingOutBroadcasterDisplayName(): string {
		return this[rawDataSymbol].from_broadcaster_user_name;
	}

	/**
	 * Gets more information about the broadcaster who sent the shoutout.
	 */
	async getShoutingOutBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(
			await this._client.users.getUserById(this[rawDataSymbol].from_broadcaster_user_id)
		);
	}

	/**
	 * The amount of viewers who were watching the sending broadcaster's stream at the time of the shoutout.
	 */
	get viewerCount(): number {
		return this[rawDataSymbol].viewer_count;
	}

	/**
	 * The Date when the shoutout was sent.
	 */
	get startDate(): Date {
		return new Date(this[rawDataSymbol].started_at);
	}
}
