import { mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';

/** @private */
export interface HelixExtensionBitsProductCostData {
	amount: number;
	type: 'bits';
}

/** @private */
export interface HelixExtensionBitsProductData {
	sku: string;
	cost: HelixExtensionBitsProductCostData;
	in_development: boolean;
	display_name: string;
	is_broadcast: boolean;
	expiration: string;
}

/**
 * The data to send to create or update a bits product.
 */
export interface HelixExtensionBitsProductUpdatePayload {
	/**
	 * The product's unique identifier.
	 *
	 * If a product with the given SKU already exists, it will be updated; otherwise, a new one will be created.
	 */
	sku: string;

	/**
	 * The product's cost, in bits.
	 */
	cost: number;

	/**
	 * The product's display name.
	 */
	displayName: string;

	/**
	 * Whether the product is in development.
	 */
	inDevelopment?: boolean;

	/**
	 * Whether to broadcast the product's purchases to all users.
	 */
	broadcast?: boolean;

	/**
	 * The product's expiration date. If this is not set, the product never expires.
	 */
	expirationDate?: string;
}

/**
 * An extension's product to purchase with Bits.
 */
@rtfm<HelixExtensionBitsProduct>('api', 'HelixExtensionBitsProduct', 'sku')
export class HelixExtensionBitsProduct extends DataObject<HelixExtensionBitsProductData> {
	/**
	 * The product's unique identifier.
	 */
	get sku(): string {
		return this[rawDataSymbol].sku;
	}

	/**
	 * The product's cost, in bits.
	 */
	get cost(): number {
		return this[rawDataSymbol].cost.amount;
	}

	/**
	 * The product's display name.
	 */
	get displayName(): string {
		return this[rawDataSymbol].display_name;
	}

	/**
	 * Whether the product is in development.
	 */
	get inDevelopment(): boolean {
		return this[rawDataSymbol].in_development;
	}

	/**
	 * Whether the product's purchases is broadcast to all users.
	 */
	get isBroadcast(): boolean {
		return this[rawDataSymbol].is_broadcast;
	}

	/**
	 * The product's expiration date. If the product never expires, this is null.
	 */
	get expirationDate(): Date | null {
		return mapNullable(this[rawDataSymbol].expiration, exp => new Date(exp));
	}
}
