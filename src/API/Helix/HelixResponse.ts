/** @private */
export default interface HelixResponse<T> {
	data: T[];
}

export interface HelixPaginatedResponse<T> extends HelixResponse<T> {
	pagination?: {
		cursor: string;
	};
}
