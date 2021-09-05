import { rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import type { HelixChannelReferenceData } from '../channel/HelixChannelReference';
import { HelixChannelReference } from '../channel/HelixChannelReference';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination, HelixPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponse, HelixResponse } from '../HelixResponse';
import type { HelixExtensionData } from './HelixExtension';
import { HelixExtension } from './HelixExtension';
import type {
	HelixExtensionBitsProductData,
	HelixExtensionBitsProductUpdatePayload
} from './HelixExtensionBitsProduct';
import { HelixExtensionBitsProduct } from './HelixExtensionBitsProduct';
import type { HelixExtensionTransactionData } from './HelixExtensionTransaction';
import { HelixExtensionTransaction } from './HelixExtensionTransaction';

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

/**
 * The Helix API methods that deal with extensions.
 *
 * Can be accessed using `client.extensions` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const transactions = await api.extionsions.getExtensionTransactions('abcd');
 * ```
 */
@rtfm('api', 'HelixExtensionsApi')
export class HelixExtensionsApi extends BaseApi {
	/**
	 * Retrieves a released extension by ID.
	 *
	 * @param extensionId The ID of the extension.
	 * @param version The version of the extension. If not given, retrieves the latest version.
	 */
	async getReleasedExtension(extensionId: string, version?: string): Promise<HelixExtension> {
		const result = await this._client.callApi<HelixResponse<HelixExtensionData>>({
			type: 'helix',
			url: 'extensions/released',
			query: {
				extension_id: extensionId,
				extension_version: version
			}
		});

		return new HelixExtension(result.data[0]);
	}

	/**
	 * Retrieves a list of channels that are currently live and have the given extension installed.
	 *
	 * @param extensionId The ID of the extension.
	 * @param pagination
	 *
	 * @expandParams
	 */
	async getLiveChannelsWithExtension(
		extensionId: string,
		pagination?: HelixForwardPagination
	): Promise<HelixPaginatedResult<HelixChannelReference>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixChannelReferenceData>>({
			type: 'helix',
			url: 'extensions/live',
			query: {
				extension_id: extensionId,
				...makePaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixChannelReference, this._client);
	}

	/**
	 * Retrieves an extension's Bits products.
	 *
	 * This only works if the provided token belongs to an extension's client ID,
	 * and will return the products for that extension.
	 *
	 * @param includeDisabled Whether to include disabled/expired products.
	 */
	async getExtensionBitsProducts(includeDisabled?: boolean): Promise<HelixExtensionBitsProduct[]> {
		const result = await this._client.callApi<HelixResponse<HelixExtensionBitsProductData>>({
			type: 'helix',
			url: 'bits/extensions',
			query: {
				should_include_all: includeDisabled?.toString()
			}
		});

		return result.data.map(data => new HelixExtensionBitsProduct(data));
	}

	/**
	 * Creates or updates a Bits product of an extension.
	 *
	 * * This only works if the provided token belongs to an extension's client ID,
	 * and will create/update a product for that extension.
	 *
	 * @param data
	 *
	 * @expandParams
	 */
	async putExtensionBitsProduct(data: HelixExtensionBitsProductUpdatePayload): Promise<HelixExtensionBitsProduct> {
		const result = await this._client.callApi<HelixResponse<HelixExtensionBitsProductData>>({
			type: 'helix',
			url: 'bits/extensions',
			method: 'PUT',
			jsonBody: {
				sku: data.sku,
				cost: {
					amount: data.cost,
					type: 'bits'
				},
				display_name: data.displayName,
				in_development: data.inDevelopment,
				expiration: data.expirationDate,
				is_broadcast: data.broadcast
			}
		});

		return new HelixExtensionBitsProduct(result.data[0]);
	}

	/**
	 * Retrieves a list of transactions for the given extension.
	 *
	 * @param extensionId The ID of the extension to retrieve transactions for.
	 * @param filter Additional filters.
	 */
	async getExtensionTransactions(
		extensionId: string,
		filter: HelixExtensionTransactionsPaginatedFilter = {}
	): Promise<HelixPaginatedResult<HelixExtensionTransaction>> {
		const result = await this._client.callApi<HelixPaginatedResponse<HelixExtensionTransactionData>>({
			type: 'helix',
			url: 'extensions/transactions',
			query: {
				extension_id: extensionId,
				id: filter.transactionIds,
				...makePaginationQuery(filter)
			}
		});

		return createPaginatedResult(result, HelixExtensionTransaction, this._client);
	}

	/**
	 * Creates a paginator for transactions for the given extension.
	 *
	 * @param extensionId The ID of the extension to retrieve transactions for.
	 * @param filter Additional filters.
	 */
	getExtensionTransactionsPaginated(
		extensionId: string,
		filter: HelixExtensionTransactionsFilter = {}
	): HelixPaginatedRequest<HelixExtensionTransactionData, HelixExtensionTransaction> {
		return new HelixPaginatedRequest(
			{
				url: 'extensions/transactions',
				query: {
					extension_id: extensionId,
					id: filter.transactionIds
				}
			},
			this._client,
			data => new HelixExtensionTransaction(data, this._client)
		);
	}
}
