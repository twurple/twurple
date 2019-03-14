/**
 * Base pagination parameters for Helix requests.
 */
export default interface HelixPagination {
	/**
	 * A cursor to get the following page of.
	 */
	after?: string;

	/**
	 * A cursor to get the previous page of.
	 */
	before?: string;

	/**
	 * The number of results per page.
	 */
	limit?: string;
}
