import { CustomError } from '@twurple/common';

/**
 * Thrown whenever a HTTP error occurs. Some HTTP errors are handled in the library when they're expected.
 */
export class HttpStatusCodeError extends CustomError {
	/** @private */
	constructor(
		private readonly _statusCode: number,
		statusText: string,
		private readonly _body: string,
		isJson: boolean
	) {
		super(
			`Encountered HTTP status code ${_statusCode}: ${statusText}\n\nBody:\n${
				!isJson && _body.length > 150 ? `${_body.substr(0, 147)  }...` : _body
			}`
		);
	}

	get statusCode(): number {
		return this._statusCode;
	}

	get body(): string {
		return this._body;
	}
}
