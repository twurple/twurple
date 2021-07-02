import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface EventSubChannelRaidEventData {
	from_broadcaster_user_id: string;
	from_broadcaster_user_login: string;
	from_broadcaster_user_name: string;
	to_broadcaster_user_id: string;
	to_broadcaster_user_login: string;
	to_broadcaster_user_name: string;
	viewers: number;
}

/**
 * An EventSub event representing a broadcaster raiding another broadcaster.
 */
@rtfm<EventSubChannelRaidEvent>('eventsub', 'EventSubChannelRaidEvent', 'raidedBroadcasterId')
export class EventSubChannelRaidEvent extends DataObject<EventSubChannelRaidEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
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
	 * Retrieves more information about the raiding broadcaster.
	 */
	async getRaidingBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].from_broadcaster_user_id))!;
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
	 * Retrieves more information about the raided broadcaster.
	 */
	async getRaidedBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this[rawDataSymbol].to_broadcaster_user_id))!;
	}

	/**
	 * The amount of viewers in the raid.
	 */
	get viewers(): number {
		return this[rawDataSymbol].viewers;
	}
}
