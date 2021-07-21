import { rawDataSymbol, rtfm } from '@twurple/common';
import type { HelixUser } from '../user/HelixUser';
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
@rtfm<HelixSubscription>('api', 'HelixSubscription', 'userId')
export class HelixSubscription extends HelixUserSubscription {
	/** @private */ declare readonly [rawDataSymbol]: HelixSubscriptionData;

	/**
	 * The user ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id))!;
	}

	/**
	 * The user ID of the gifter.
	 */
	get gifterId(): string {
		return this[rawDataSymbol].gifter_id;
	}

	/**
	 * The name of the gifter.
	 */
	get gifterName(): string {
		return this[rawDataSymbol].gifter_login;
	}

	/**
	 * The display name of the gifter.
	 */
	get gifterDisplayName(): string {
		return this[rawDataSymbol].gifter_name;
	}

	/**
	 * Retrieves more information about the gifter.
	 */
	async getGifter(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].gifter_id))!;
	}

	/**
	 * The user ID of the subscribed user.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the subscribed user.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the subscribed user.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Retrieves more information about the subscribed user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.users.getUserById(this[rawDataSymbol].user_id))!;
	}
}
