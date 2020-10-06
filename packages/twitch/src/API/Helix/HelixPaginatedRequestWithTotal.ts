import { HelixPaginatedRequest } from './HelixPaginatedRequest';
import type { HelixPaginatedResponseWithTotal } from './HelixResponse';

/**
 * A special case of {@HelixPaginatedRequest} with support for fetching the total number of entities, whenever an endpoint supports it.
 */
export class HelixPaginatedRequestWithTotal<D, T> extends HelixPaginatedRequest<D, T> {
	/** @private */
	protected _currentData?: HelixPaginatedResponseWithTotal<D>;

	/**
	 * Retrieves and returns the total number of entities existing in the queried result set.
	 */
	async getTotalCount(): Promise<number> {
		const data =
			this._currentData ||
			((await this._fetchData({ query: { after: undefined } })) as HelixPaginatedResponseWithTotal<D>);
		return data.total;
	}
}
