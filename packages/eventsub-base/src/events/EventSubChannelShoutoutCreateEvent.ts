import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelShoutoutCreateEventData } from './EventSubChannelShoutoutCreateEvent.external';

/**
 * An EventSub event representing a broadcaster shouting out another broadcaster.
 */
@rtfm<EventSubChannelShoutoutCreateEvent>(
	'eventsub-base',
	'EventSubChannelShoutoutCreateEvent',
	'shoutedOutBroadcasterId'
)
export class EventSubChannelShoutoutCreateEvent extends DataObject<EventSubChannelShoutoutCreateEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelShoutoutCreateEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the broadcaster who sent the shoutout.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster who sent the shoutout.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster who sent the shoutout.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster who sent the shoutout.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_user_id));
	}

	/**
	 * The ID of the broadcaster who was shoutout out.
	 */
	get shoutedOutBroadcasterId(): string {
		return this[rawDataSymbol].to_broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster who was shoutout out.
	 */
	get shoutedOutBroadcasterName(): string {
		return this[rawDataSymbol].to_broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster who was shoutout out.
	 */
	get shoutedOutBroadcasterDisplayName(): string {
		return this[rawDataSymbol].to_broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster who was shoutout out.
	 */
	async getShoutedOutBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].to_broadcaster_user_id));
	}

	/**
	 * The amount of viewers who were watching the sending broadcaster's stream at the time they sent the shoutout.
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

	/**
	 * The Date when the broadcaster may send a shoutout to a different broadcaster.
	 */
	get cooldownEndDate(): Date {
		return new Date(this[rawDataSymbol].cooldown_ends_at);
	}

	/**
	 * The Date when the broadcaster may send another shoutout to the same broadcaster.
	 */
	get targetCooldownEndDate(): Date {
		return new Date(this[rawDataSymbol].target_cooldown_ends_at);
	}
}
