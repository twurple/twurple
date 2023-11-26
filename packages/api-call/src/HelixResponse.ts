/** @private */
export interface HelixResponse<T> {
	data: T[];
}

/** @private */
export interface HelixPaginatedResponse<T> extends HelixResponse<T> {
	pagination?:
		| string
		| {
				cursor?: string;
		  };
}

/** @private */
export interface HelixPaginatedResponseWithTotal<T> extends HelixPaginatedResponse<T> {
	total: number;
}
