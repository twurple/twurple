import { checkRelationAssertion, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixSubscriptionData } from '../../../interfaces/helix/subscription.external';
import type { HelixUser } from '../user/HelixUser';
import { HelixUserSubscription } from './HelixUserSubscription';

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
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The user ID of the gifter.
	 */
	get gifterId(): string | null {
		return this[rawDataSymbol].is_gift ? this[rawDataSymbol].gifter_id : null;
	}

	/**
	 * The name of the gifter.
	 */
	get gifterName(): string | null {
		return this[rawDataSymbol].is_gift ? this[rawDataSymbol].gifter_login : null;
	}

	/**
	 * The display name of the gifter.
	 */
	get gifterDisplayName(): string | null {
		return this[rawDataSymbol].is_gift ? this[rawDataSymbol].gifter_name : null;
	}

	/**
	 * Gets more information about the gifter.
	 */
	async getGifter(): Promise<HelixUser | null> {
		return this[rawDataSymbol].is_gift
			? checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].gifter_id))
			: null;
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
	 * Gets more information about the subscribed user.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}
}
