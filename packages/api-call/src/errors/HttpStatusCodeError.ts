import { CustomError } from '@twurple/common';

/**
 * Thrown whenever a HTTP error occurs. Some HTTP errors are handled in the library when they're expected.
 */
export class HttpStatusCodeError extends CustomError {
	/** @private */
	constructor(
		private readonly _statusCode: number,
		statusText: string,
		private readonly _url: string,
		private readonly _method: string,
		private readonly _body: string,
		isJson: boolean,
	) {
		super(
			`Encountered HTTP status code ${_statusCode}: ${statusText}\n\nURL: ${_url}\nMethod: ${_method}\nBody:\n${
				!isJson && _body.length > 150 ? `${_body.slice(0, 147)}...` : _body
			}`,
		);
	}

	/**
	 * The HTTP status code of the error.
	 */
	get statusCode(): number {
		return this._statusCode;
	}

	/**
	 * The URL that was requested.
	 */
	get url(): string {
		return this._url;
	}

	/**
	 * The HTTP method that was used for the request.
	 */
	get method(): string {
		return this._method;
	}

	/**
	 * The body that was used for the request, as a string.
	 */
	get body(): string {
		return this._body;
	}
}
