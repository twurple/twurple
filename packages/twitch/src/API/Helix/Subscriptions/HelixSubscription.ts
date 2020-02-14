import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';

/** @private */
export interface HelixSubscriptionData {
	broadcaster_id: string;
	broadcaster_name: string;
	is_gift: boolean;
	plan_name: string;
	tier: string;
	user_id: string;
	user_name: string;
	message?: string;
}

/**
 * A (paid) subscription of a user to a broadcaster.
 */
export default class HelixSubscription {
	/** @private */
	@NonEnumerable protected readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixSubscriptionData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The user ID of the broadcaster.
	 */
	get broadcasterId() {
		return this._data.broadcaster_id;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName() {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves more data about the broadcaster.
	 */
	async getBroadcaster() {
		return this._client.helix.users.getUserById(this.broadcasterId);
	}

	/**
	 * Whether the subscription has been gifted by another user.
	 */
	get isGift() {
		return this._data.is_gift;
	}

	/**
	 * The tier of the subscription.
	 */
	get tier() {
		return this._data.tier;
	}

	/**
	 * The user ID of the subscribed user.
	 */
	get userId() {
		return this._data.user_id;
	}

	/**
	 * The display name of the subscribed user.
	 */
	get userDisplayName() {
		return this._data.user_name;
	}

	/**
	 * Retrieves more data about the subscribed user.
	 */
	async getUser() {
		return this._client.helix.users.getUserById(this.userId);
	}
}
