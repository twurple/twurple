/**
 * Base forward pagination parameters for Helix requests.
 */
export interface HelixForwardPagination {
	/**
	 * The number of results per page.
	 */
	limit?: string;

	/**
	 * A cursor to get the following page of.
	 */
	after?: string;
}

/**
 * Base pagination parameters for Helix requests.
 *
 * @inheritDoc
 */
export interface HelixPagination extends HelixForwardPagination {
	/**
	 * A cursor to get the previous page of.
	 */
	before?: string;
}

/** @private */
export function makePaginationQuery({ after, before, limit }: HelixPagination = {}): Record<
	string,
	string | undefined
> {
	return {
		after,
		before,
		first: limit
	};
}
