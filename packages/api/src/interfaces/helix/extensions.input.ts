import { type HelixPagination } from '../../api/helix/HelixPagination';

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
 * Filters for the extension transactions request.
 */
export interface HelixExtensionTransactionsFilter {
	/**
	 * The IDs of the transactions.
	 */
	transactionIds?: string[];
}

/**
 * @inheritDoc
 */
export interface HelixExtensionTransactionsPaginatedFilter extends HelixExtensionTransactionsFilter, HelixPagination {}
