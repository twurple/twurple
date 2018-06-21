/**
 * A result coming from a Helix resource that is paginated using a cursor.
 */
export default interface HelixPaginatedResult<T> {
	/**
	 * The returned data.
	 */
	data: T;

	/**
	 * A cursor for traversing more results.
	 */
	cursor: string;
}
