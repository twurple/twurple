import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from 'twitch';
import { rtfm } from 'twitch-common';

/** @private */
export interface EventSubExtensionBitsTransactionCreateEventProductData {
	name: string;
	sku: string;
	bits: number;
	in_development: boolean;
}

/** @private */
export interface EventSubExtensionBitsTransactionCreateEventData {
	id: string;
	extension_client_id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	broadcaster_user_id: string;
	broadcaster_user_login: string;
	broadcaster_user_name: string;
	product: EventSubExtensionBitsTransactionCreateEventProductData;
}

/**
 * An EventSub event representing a channel subscription.
 */
@rtfm<EventSubExtensionBitsTransactionCreateEvent>(
	'twitch-eventsub',
	'EventSubExtensionBitsTransactionCreateEvent',
	'id'
)
export class EventSubExtensionBitsTransactionCreateEvent {
	/** @private */
	@Enumerable(false) protected readonly _client: ApiClient;

	/** @private */
	constructor(private readonly _data: EventSubExtensionBitsTransactionCreateEventData, client: ApiClient) {
		this._client = client;
	}

	/**
	 * The ID of the transaction.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The client ID of the extension.
	 */
	get clientId(): string {
		return this._data.extension_client_id;
	}

	/**
	 * The ID of the subscribing user.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The name of the subscribing user.
	 */
	get userName(): string {
		return this._data.user_login;
	}

	/**
	 * The display name of the subscribing user.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves more information about the subscribing user.
	 */
	async getUser(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.user_id))!;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_user_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this._data.broadcaster_user_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_user_name;
	}

	/**
	 * Retrieves more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return (await this._client.helix.users.getUserById(this._data.broadcaster_user_id))!;
	}

	/**
	 * The name of the product the transaction is referring to.
	 */
	get productName(): string {
		return this._data.product.name;
	}

	/**
	 * The SKU of the product the transaction is referring to.
	 */
	get productSku(): string {
		return this._data.product.sku;
	}

	/**
	 * The cost of the product the transaction is referring to, in Bits.
	 */
	get productCost(): number {
		return this._data.product.bits;
	}

	/**
	 * Whether the product the transaction is referring to is in development.
	 */
	get productInDevelopment(): boolean {
		return this._data.product.in_development;
	}
}
