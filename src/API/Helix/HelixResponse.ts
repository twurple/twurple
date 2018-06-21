/** @private */
interface HelixResponse<T> {
	data: T;
	pagination: {
		cursor: string;
	};
}

export default HelixResponse;
