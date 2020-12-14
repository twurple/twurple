import { CustomError } from './CustomError';

/**
 * Thrown whenever a HTTP error occurs. Some HTTP errors are handled in the library when they're expected.
 */
export class HttpStatusCodeError extends CustomError {
	private readonly _statusCode: number;
	private readonly _body: Record<string, unknown>;

	/** @private */
	constructor(statusCode: number, statusText: string, body: Record<string, unknown>) {
		super(`Encountered HTTP status code ${statusCode}: ${statusText}\n\nBody:\n${JSON.stringify(body, null, 2)}`);
		this._statusCode = statusCode;
		this._body = body;
	}

	get statusCode(): number {
		return this._statusCode;
	}

	get body(): Record<string, unknown> {
		return this._body;
	}
}
