/** @private */
export default class CustomError extends Error {
	constructor(message: string) {
		super();
		this.name = this.constructor.name;
		this.message = message;
		Error.captureStackTrace(this, this.constructor);
	}
}
