export default interface HelixPaginatedResult<T> {
	data: T;
	cursor: string;
}
