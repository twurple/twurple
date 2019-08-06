import HelixPaginatedRequest from './HelixPaginatedRequest';
import { HelixPaginatedResponseWithTotal } from './HelixResponse';

/**
 * A special case of {@HelixPaginatedRequest} with support for fetching the total number of entities, whenever an endpoint supports it.
 */
export default class HelixPaginatedRequestWithTotal<D, T> extends HelixPaginatedRequest<D, T> {
	/** @private */
	protected _currentData?: HelixPaginatedResponseWithTotal<D>;

	/**
	 * Retrieves and returns the total number of entities existing in the queried result set.
	 */
	async getTotalCount() {
		const data =
			this._currentData ||
			((await this._fetchData({ query: { first: '1', after: undefined } })) as HelixPaginatedResponseWithTotal<
				D
			>);

		return data.total;
	}
}
