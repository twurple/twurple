/** @private */
export default class CustomError extends Error {
	constructor(...params: [string, string?, string?]) {
		// @ts-ignore
		super(...params);
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	get name() {
		return this.constructor.name;
	}
}
