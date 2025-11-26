import { mapNullable } from '@d-fischer/shared-utils';
import { DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { type HelixExtensionBitsProductData } from '../../interfaces/endpoints/extensions.external.js';

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
