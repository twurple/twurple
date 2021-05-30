import { rtfm } from 'twitch-common';
import type { HelixUser } from '../User/HelixUser';
import type { HelixUserSubscriptionData } from './HelixUserSubscription';
import { HelixUserSubscription } from './HelixUserSubscription';

/** @private */
export interface HelixSubscriptionData extends HelixUserSubscriptionData {
	gifter_id: string;
	gifter_login: string;
	gifter_name: string;
	plan_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	message?: string;
}

/**
 * A (paid) subscription of a user to a broadcaster.
 *
 * @inheritDoc
 */
@rtfm<HelixSubscription>('twitch', 'HelixSubscription', 'userId')
export class HelixSubscription extends HelixUserSubscription {
	/** @private */ protected declare readonly _data: HelixSubscriptionData;

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
