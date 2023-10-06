import { Enumerable } from '@d-fischer/shared-utils';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type BaseApiClient } from '../../client/BaseApiClient';
import {
	type HelixExtensionProductType,
	type HelixExtensionTransactionData,
} from '../../interfaces/endpoints/extensions.external';
import type { HelixUser } from '../user/HelixUser';

/**
 * A bits transaction made inside an extension.
 */
@rtfm<HelixExtensionTransaction>('api', 'HelixExtensionTransaction', 'id')
export class HelixExtensionTransaction extends DataObject<HelixExtensionTransactionData> {
	/** @internal */ @Enumerable(false) private readonly _client: BaseApiClient;

	/** @internal */
	constructor(data: HelixExtensionTransactionData, client: BaseApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * The ID of the transaction.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The time when the transaction was made.
	 */
	get transactionDate(): Date {
		return new Date(this[rawDataSymbol].timestamp);
	}

	/**
	 * The ID of the broadcaster that runs the extension on their channel.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster that runs the extension on their channel.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * The display name of the broadcaster that runs the extension on their channel.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Gets information about the broadcaster that runs the extension on their channel.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The ID of the user that made the transaction.
	 */
	get userId(): string {
		return this[rawDataSymbol].user_id;
	}

	/**
	 * The name of the user that made the transaction.
	 */
	get userName(): string {
		return this[rawDataSymbol].user_login;
	}

	/**
	 * The display name of the user that made the transaction.
	 */
	get userDisplayName(): string {
		return this[rawDataSymbol].user_name;
	}

	/**
	 * Gets information about the user that made the transaction.
	 */
	async getUser(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].user_id));
	}

	/**
	 * The product type. Currently always BITS_IN_EXTENSION.
	 */
	get productType(): HelixExtensionProductType {
		return this[rawDataSymbol].product_type;
	}

	/**
	 * The product SKU.
	 */
	get productSku(): string {
		return this[rawDataSymbol].product_data.sku;
	}

	/**
	 * The cost of the product, in bits.
	 */
	get productCost(): number {
		return this[rawDataSymbol].product_data.cost.amount;
	}

	/**
	 * The display name of the product.
	 */
	get productDisplayName(): string {
		return this[rawDataSymbol].product_data.displayName;
	}

	/**
	 * Whether the product is in development.
	 */
	get productInDevelopment(): boolean {
		return this[rawDataSymbol].product_data.inDevelopment;
	}
}
