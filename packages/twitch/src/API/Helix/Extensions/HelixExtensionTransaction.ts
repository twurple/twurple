import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from 'twitch-common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from '../User/HelixUser';
import type { HelixExtensionProductData } from './HelixExtensionProductData';

type HelixExtensionProductType = 'BITS_IN_EXTENSION';

/** @private */
export interface HelixExtensionTransactionData {
	id: string;
	timestamp: string;
	broadcaster_id: string;
	broadcaster_name: string;
	user_id: string;
	user_name: string;
	product_type: HelixExtensionProductType;
	product_data: HelixExtensionProductData;
}

/**
 * A bits transaction made inside an extension.
 */
@rtfm<HelixExtensionTransaction>('twitch', 'HelixExtensionTransaction', 'id')
export class HelixExtensionTransaction {
	@Enumerable(false) private readonly _data: HelixExtensionTransactionData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixExtensionTransactionData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The ID of the transaction.
	 */
	get id(): string {
		return this._data.id;
	}

	/**
	 * The time when the transaction was made.
	 */
	get transactionDate(): Date {
		return new Date(this._data.timestamp);
	}

	/**
	 * The ID of the broadcaster that runs the extension on their channel.
	 */
	get broadcasterId(): string {
		return this._data.broadcaster_id;
	}

	/**
	 * The display name of the broadcaster that runs the extension on their channel.
	 */
	get broadcasterDisplayName(): string {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves information about the broadcaster that runs the extension on their channel.
	 */
	async getBroadcaster(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * The ID of the user that made the transaction.
	 */
	get userId(): string {
		return this._data.user_id;
	}

	/**
	 * The display name of the user that made the transaction.
	 */
	get userDisplayName(): string {
		return this._data.user_name;
	}

	/**
	 * Retrieves information about the user that made the transaction.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	/**
	 * The product type. Currently always BITS_IN_EXTENSION.
	 */
	get productType(): HelixExtensionProductType {
		return this._data.product_type;
	}

	/**
	 * The product SKU.
	 */
	get productSku(): string {
		return this._data.product_data.sku;
	}

	/**
	 * The cost of the product, in bits.
	 */
	get productCost(): number {
		return this._data.product_data.cost.amount;
	}

	/**
	 * The display name of the product.
	 */
	get productDisplayName(): string {
		return this._data.product_data.displayName;
	}

	/**
	 * Whether the product is in development.
	 */
	get productInDevelopment(): boolean {
		return this._data.product_data.inDevelopment;
	}
}
