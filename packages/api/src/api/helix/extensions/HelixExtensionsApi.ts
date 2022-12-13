import type { HelixPaginatedResponse, HelixResponse } from '@twurple/api-call';
import type { HelixExtensionData } from '@twurple/common';
import { HelixExtension, rtfm } from '@twurple/common';
import { type HelixChannelReferenceData } from '../../../interfaces/helix/channel.external';
import {
	createExtensionProductBody,
	createExtensionTransactionQuery,
	createReleasedExtensionFilter,
	type HelixExtensionBitsProductData,
	type HelixExtensionTransactionData
} from '../../../interfaces/helix/extensions.external';
import {
	type HelixExtensionBitsProductUpdatePayload,
	type HelixExtensionTransactionsFilter,
	type HelixExtensionTransactionsPaginatedFilter
} from '../../../interfaces/helix/extensions.input';
import { createSingleKeyQuery } from '../../../interfaces/helix/generic.external';
import { BaseApi } from '../../BaseApi';
import { HelixChannelReference } from '../channel/HelixChannelReference';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixForwardPagination } from '../HelixPagination';
import { createPaginationQuery } from '../HelixPagination';
import { HelixExtensionBitsProduct } from './HelixExtensionBitsProduct';
import { HelixExtensionTransaction } from './HelixExtensionTransaction';

/**
 * The Helix API methods that deal with extensions.
 *
 * Can be accessed using `client.extensions` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const transactions = await api.extionsions.getExtensionTransactions('abcd');
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Extensions
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
			query: createReleasedExtensionFilter(extensionId, version)
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
				...createSingleKeyQuery('extension_id', extensionId),
				...createPaginationQuery(pagination)
			}
		});

		return createPaginatedResult(result, HelixChannelReference, this._client);
	}

	/**
	 * Creates a paginator for channels that are currently live and have the given extension installed.
	 *
	 * @param extensionId The ID of the extension.
	 */
	getLiveChannelsWithExtensionPaginated(
		extensionId: string
	): HelixPaginatedRequest<HelixChannelReferenceData, HelixChannelReference> {
		return new HelixPaginatedRequest(
			{
				url: 'extensions/live',
				query: createSingleKeyQuery('extension_id', extensionId)
			},
			this._client,
			data => new HelixChannelReference(data, this._client)
		);
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
			query: createSingleKeyQuery('should_include_all', includeDisabled?.toString())
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
			jsonBody: createExtensionProductBody(data)
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
				...createExtensionTransactionQuery(extensionId, filter),
				...createPaginationQuery(filter)
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
				query: createExtensionTransactionQuery(extensionId, filter)
			},
			this._client,
			data => new HelixExtensionTransaction(data, this._client)
		);
	}
}
