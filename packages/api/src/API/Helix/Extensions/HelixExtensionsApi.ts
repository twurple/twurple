import { rtfm } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import { HelixPaginatedRequest } from '../HelixPaginatedRequest';
import type { HelixPaginatedResult } from '../HelixPaginatedResult';
import { createPaginatedResult } from '../HelixPaginatedResult';
import type { HelixPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import type { HelixPaginatedResponse } from '../HelixResponse';
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
 * Can be accessed using `client.helix.extensions` on an {@ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient(new StaticAuthProvider(clientId, accessToken));
 * const transactions = await api.helix.extionsions.getExtensionTransactions('abcd');
 * ```
 */
@rtfm('api', 'HelixExtensionsApi')
export class HelixExtensionsApi extends BaseApi {
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
