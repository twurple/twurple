import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';

/** @private */
export interface HelixSubscriptionData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	gifter_id: string;
	gifter_login: string;
	gifter_name: string;
	is_gift: boolean;
	plan_name: string;
	tier: string;
	user_id: string;
	user_login: string;
	user_name: string;
	message?: string;
}

/**
 * A (paid) subscription of a user to a broadcaster.
 */
@rtfm<HelixSubscription>('api', 'HelixSubscription', 'userId')
export class HelixSubscription {
	@Enumerable(false) private readonly _data: HelixSubscriptionData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixSubscriptionData, client: ApiClient) {
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
	 * The user ID of the gifter.
	 */
	get gifterId(): string {
		return this._data.gifter_id;
	}

	/**
	 * The name of the gifter.
	 */
	get gifterName(): string {
		return this._data.gifter_login;
	}

	/**
	 * The display name of the gifter.
	 */
	get giftName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the gifter.
	 */
	async getGifter(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.gifter_id);
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

	/**
	 * The user ID of the subscribed user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the subscribed user.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the subscribed user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the subscribed user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}
}
