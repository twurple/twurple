import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type EventSubChannelRaidEventData } from './EventSubChannelRaidEvent.external.js';

/**
 * An EventSub event representing a broadcaster raiding another broadcaster.
 */
@rtfm<EventSubChannelRaidEvent>('eventsub-base', 'EventSubChannelRaidEvent', 'raidedBroadcasterId')
export class EventSubChannelRaidEvent extends DataObject<EventSubChannelRaidEventData> {
	/** @internal */ @Enumerable(false) private readonly _client: ApiClient;

	/** @internal */
	constructor(data: EventSubChannelRaidEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the raiding broadcaster.
	 */
	get raidingBroadcasterId(): string {
		return this[rawDataSymbol].from_broadcaster_user_id;
	}

	/**
	 * The name of the raiding broadcaster.
	 */
	get raidingBroadcasterName(): string {
		return this[rawDataSymbol].from_broadcaster_user_login;
	}

	/**
	 * The display name of the raiding broadcaster.
	 */
	get raidingBroadcasterDisplayName(): string {
		return this[rawDataSymbol].from_broadcaster_user_name;
	}

	/**
	 * Gets more information about the raiding broadcaster.
	 */
	async getRaidingBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(
			await this._client.users.getUserById(this[rawDataSymbol].from_broadcaster_user_id),
		);
	}

	/**
	 * The ID of the raided broadcaster.
	 */
	get raidedBroadcasterId(): string {
		return this[rawDataSymbol].to_broadcaster_user_id;
	}

	/**
	 * The name of the raided broadcaster.
	 */
	get raidedBroadcasterName(): string {
		return this[rawDataSymbol].to_broadcaster_user_login;
	}

	/**
	 * The display name of the raided broadcaster.
	 */
	get raidedBroadcasterDisplayName(): string {
		return this[rawDataSymbol].to_broadcaster_user_name;
	}

	/**
	 * Gets more information about the raided broadcaster.
	 */
	async getRaidedBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].to_broadcaster_user_id));
	}

	/**
	 * The amount of viewers in the raid.
	 */
	get viewers(): number {
		return this[rawDataSymbol].viewers;
	}
}
