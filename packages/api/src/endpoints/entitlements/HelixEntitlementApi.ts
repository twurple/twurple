import { Enumerable, mapOptional } from '@d-fischer/shared-utils';
import { type HelixPaginatedResponse, type HelixResponse } from '@twurple/api-call';
import { extractUserId, rtfm } from '@twurple/common';
import {
	createDropsEntitlementQuery,
	createDropsEntitlementUpdateBody,
	type HelixDropsEntitlementData,
	type HelixDropsEntitlementFulfillmentStatus,
	type HelixDropsEntitlementUpdateData,
	type HelixDropsEntitlementUpdateStatus
} from '../../interfaces/endpoints/entitlement.external';
import {
	type HelixDropsEntitlementFilter,
	type HelixDropsEntitlementPaginatedFilter
} from '../../interfaces/endpoints/entitlement.input';
import { HelixRequestBatcher } from '../../utils/HelixRequestBatcher';
import { HelixPaginatedRequest } from '../../utils/pagination/HelixPaginatedRequest';
import { createPaginatedResult, type HelixPaginatedResult } from '../../utils/pagination/HelixPaginatedResult';
import { createPaginationQuery } from '../../utils/pagination/HelixPagination';
import { BaseApi } from '../BaseApi';
import { HelixDropsEntitlement } from './HelixDropsEntitlement';

/**
 * The Helix API methods that deal with entitlements (drops).
 *
 * Can be accessed using `client.entitlements` on an {@link ApiClient} instance.
 *
 * ## Example
 * ```ts
 * const api = new ApiClient({ authProvider });
 * const clipId = await api.entitlements.getDropsEntitlements();
 * ```
 *
 * @meta category helix
 * @meta categorizedTitle Entitlements (Drops)
 */
@rtfm('api', 'HelixEntitlementApi')
export class HelixEntitlementApi extends BaseApi {
	/** @internal */ @Enumerable(false) private readonly _getDropsEntitlementByIdBatcher = new HelixRequestBatcher(
		{
			url: 'entitlements/drops'
		},
		'id',
		'id',
		this._client,
		(data: HelixDropsEntitlementData) => new HelixDropsEntitlement(data, this._client)
	);

	/**
	 * Gets the drops entitlements for the given filter.
	 *
	 * @expandParams
	 *
	 * @param filter
	 * @param alwaysApp Whether an app token should always be used, even if a user filter is given.
	 */
	async getDropsEntitlements(
		filter: HelixDropsEntitlementPaginatedFilter,
		alwaysApp = false
	): Promise<HelixPaginatedResult<HelixDropsEntitlement>> {
		const response = await this._client.callApi<HelixPaginatedResponse<HelixDropsEntitlementData>>({
			type: 'helix',
			url: 'entitlements/drops',
			userId: mapOptional(filter.user, extractUserId),
			forceType: filter.user && alwaysApp ? 'app' : undefined,
			query: {
				...createDropsEntitlementQuery(filter, alwaysApp),
				...createPaginationQuery(filter)
			}
		});

		return createPaginatedResult(response, HelixDropsEntitlement, this._client);
	}

	/**
	 * Creates a paginator for drops entitlements for the given filter.
	 *
	 * @expandParams
	 *
	 * @param filter
	 * @param alwaysApp Whether an app token should always be used, even if a user filter is given.
	 */
	getDropsEntitlementsPaginated(
		filter: HelixDropsEntitlementFilter,
		alwaysApp = false
	): HelixPaginatedRequest<HelixDropsEntitlementData, HelixDropsEntitlement> {
		return new HelixPaginatedRequest(
			{
				url: 'entitlements/drops',
				userId: mapOptional(filter.user, extractUserId),
				forceType: filter.user && alwaysApp ? 'app' : undefined,
				query: createDropsEntitlementQuery(filter, alwaysApp)
			},
			this._client,
			data => new HelixDropsEntitlement(data, this._client)
		);
	}

	/**
	 * Gets the drops entitlements for the given IDs.
	 *
	 * @param ids The IDs to fetch.
	 */
	async getDropsEntitlementsByIds(ids: string[]): Promise<HelixDropsEntitlement[]> {
		const response = await this._client.callApi<HelixResponse<HelixDropsEntitlementData>>({
			type: 'helix',
			url: 'entitlements/drops',
			query: {
				id: ids
			}
		});

		return response.data.map(data => new HelixDropsEntitlement(data, this._client));
	}

	/**
	 * Gets the drops entitlement for the given ID.
	 *
	 * @param id The ID to fetch.
	 */
	async getDropsEntitlementById(id: string): Promise<HelixDropsEntitlement | null> {
		const result = await this.getDropsEntitlementsByIds([id]);

		return result[0] ?? null;
	}

	/**
	 * Gets the drops entitlement for the given ID, batching multiple calls into fewer requests as the API allows.
	 *
	 * @param id The ID to fetch.
	 */
	async getDropsEntitlementByIdBatched(id: string): Promise<HelixDropsEntitlement | null> {
		return await this._getDropsEntitlementByIdBatcher.request(id);
	}

	/**
	 * Updates the status of a list of drops entitlements.
	 *
	 * Returns a map that associates each given ID with its update status.
	 *
	 * @param ids The IDs of the entitlements.
	 * @param fulfillmentStatus The fulfillment status to set the entitlements to.
	 */
	async updateDropsEntitlements(
		ids: string[],
		fulfillmentStatus: HelixDropsEntitlementFulfillmentStatus
	): Promise<Map<string, HelixDropsEntitlementUpdateStatus>> {
		const response = await this._client.callApi<HelixResponse<HelixDropsEntitlementUpdateData>>({
			type: 'helix',
			url: 'entitlements/drops',
			method: 'PATCH',
			jsonBody: createDropsEntitlementUpdateBody(ids, fulfillmentStatus)
		});

		return new Map(response.data.flatMap(entry => entry.ids.map(id => [id, entry.status])));
	}
}
