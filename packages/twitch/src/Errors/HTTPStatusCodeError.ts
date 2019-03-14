import CustomError from './CustomError';

/**
 * Thrown whenever a HTTP error occurs. Some HTTP errors are handled in the library when they're expected.
 */
export default class HTTPStatusCodeError extends CustomError {
	private readonly _statusCode: number;
	// tslint:disable-next-line:no-any
	private readonly _body: any;

	/** @private */
	constructor(statusCode: number, statusText: string, body: string) {
		super(`Encountered HTTP status code ${statusCode}: ${statusText}\n\nBody:\n${JSON.stringify(body, null, 2)}`);
		this._statusCode = statusCode;
		this._body = body;
	}

	get statusCode() {
		return this._statusCode;
	}

	get body() {
		return this._body;
	}
}
