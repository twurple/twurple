import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/** @private */
export interface HelixUserSubscriptionData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	is_gift: boolean;
	tier: string;
}

/**
 * The user info about a (paid) subscription to a broadcaster.
 */
@rtfm<HelixUserSubscription>('twitch', 'HelixUserSubscription', 'broadcasterId')
export class HelixUserSubscription {
	/** @private */ @Enumerable(false) protected readonly _data: HelixUserSubscriptionData;
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixUserSubscriptionData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The user ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * Whether the subscription has been gifted by another user.
	 */
	get isGift(): boolean {
		return this._data.is_gift;
	}

	/**
	 * The tier of the subscription.
	 */
	get tier(): string {
		return this._data.tier;
	}
}
