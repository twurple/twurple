/** @private */
export default interface HelixResponse<T> {
	data: T;
	pagination: {
		cursor: string;
	};
}
