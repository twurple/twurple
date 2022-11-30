import { Enumerable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import { type HelixUserSubscriptionData } from '../../../interfaces/helix/subscription.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * The user info about a (paid) subscription to a broadcaster.
 */
@rtfm<HelixUserSubscription>('api', 'HelixUserSubscription', 'broadcasterId')
export class HelixUserSubscription extends DataObject<HelixUserSubscriptionData> {
	/** @private */ @Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixUserSubscriptionData, client: ApiClient) {
		super(data);
		this._client = client;
	}

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
	async getBroadcaster(): Promise<HelixUser | null> {
		return await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id);
	}

	/**
	 * Whether the subscription has been gifted by another user.
	 */
	get isGift(): boolean {
		return this[rawDataSymbol].is_gift;
	}

	/**
	 * The tier of the subscription.
	 */
	get tier(): string {
		return this[rawDataSymbol].tier;
	}
}
