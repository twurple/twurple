import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

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
@rtfm<EventSubChannelRaidEvent>('twitch-eventsub', 'EventSubChannelRaidEvent', 'raidedBroadcasterId')
export class EventSubChannelRaidEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubChannelRaidEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the raiding broadcaster.
	 */
	get raidingBroadcasterId(): string {
		return this._data.from_broadcaster_user_id;
	}

	/**
	 * The name of the raiding broadcaster.
	 */
	get raidingBroadcasterName(): string {
		return this._data.from_broadcaster_user_login;
	}

	/**
	 * The display name of the raiding broadcaster.
	 */
	get raidingBroadcasterDisplayName(): string {
		return this._data.from_broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the raiding broadcaster.
	 */
	async getRaidingBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.from_broadcaster_user_id))!;
	}

	/**
	 * The ID of the raided broadcaster.
	 */
	get raidedBroadcasterId(): string {
		return this._data.to_broadcaster_user_id;
	}

	/**
	 * The name of the raided broadcaster.
	 */
	get raidedBroadcasterName(): string {
		return this._data.to_broadcaster_user_login;
	}

	/**
	 * The display name of the raided broadcaster.
	 */
	get raidedBroadcasterDisplayName(): string {
		return this._data.to_broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the raided broadcaster.
	 */
	async getRaidedBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.to_broadcaster_user_id))!;
	}

	/**
	 * The amount of viewers in the raid.
	 */
	get viewers(): number {
		return this._data.viewers;
	}
}
