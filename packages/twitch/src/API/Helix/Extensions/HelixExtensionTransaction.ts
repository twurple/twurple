import { NonEnumerable } from '@d-fischer/shared-utils';
import TwitchClient from '../../../TwitchClient';
import HelixExtensionProductData from './HelixExtensionProductData';

/** @private */
export interface HelixExtensionTransactionData {
	id: string;
	timestamp: string;
	broadcaster_id: string;
	broadcaster_name: string;
	user_id: string;
	user_name: string;
	product_type: 'BITS_IN_EXTENSION';
	product_data: HelixExtensionProductData;
}

/**
 * A bits transaction made inside an extension.
 */
export default class HelixExtensionTransaction {
	@NonEnumerable private readonly _client: TwitchClient;

	/** @private */
	constructor(private readonly _data: HelixExtensionTransactionData, client: TwitchClient) {
		this._client = client;
	}

	/**
	 * The ID of the transaction.
	 */
	get id() {
		return this._data.id;
	}

	/**
	 * The time when the transaction was made.
	 */
	get transactionDate() {
		return new Date(this._data.timestamp);
	}

	/**
	 * The ID of the broadcaster that runs the extension on their channel.
	 */
	get broadcasterId() {
		return this._data.broadcaster_id;
	}

	/**
	 * The display name of the broadcaster that runs the extension on their channel.
	 */
	get broadcasterDisplayName() {
		return this._data.broadcaster_name;
	}

	/**
	 * Retrieves information about the broadcaster that runs the extension on their channel.
	 */
	async getBroadcaster() {
		return this._client.helix.users.getUserById(this._data.broadcaster_id);
	}

	/**
	 * The ID of the user that made the transaction.
	 */
	get userId() {
		return this._data.user_id;
	}

	/**
	 * The display name of the user that made the transaction.
	 */
	get userDisplayName() {
		return this._data.user_name;
	}

	/**
	 * Retrieves information about the user that made the transaction.
	 */
	async getUser() {
		return this._client.helix.users.getUserById(this._data.user_id);
	}

	/**
	 * The product type. Currently always BITS_IN_EXTENSION.
	 */
	get productType() {
		return this._data.product_type;
	}

	/**
	 * The product SKU.
	 */
	get productSKU() {
		return this._data.product_data.sku;
	}

	/**
	 * The cost of the product, in bits.
	 */
	get productCost() {
		return this._data.product_data.cost.amount;
	}

	/**
	 * The display name of the product.
	 */
	get productDisplayName() {
		return this._data.product_data.displayName;
	}

	/**
	 * Whether the product is in development.
	 */
	get productInDevelopment() {
		return this._data.product_data.inDevelopment;
	}
}
