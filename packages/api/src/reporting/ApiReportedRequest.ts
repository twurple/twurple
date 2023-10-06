import { type TwitchApiCallOptions } from '@twurple/api-call';

/**
 * Reporting details for an API request.
 */
export class ApiReportedRequest {
	/** @internal */
	constructor(
		private readonly _options: TwitchApiCallOptions,
		private readonly _httpStatus: number,
		private readonly _resolvedUserId: string | null,
	) {}

	/**
	 * The options used to call the API.
	 */
	get options(): TwitchApiCallOptions {
		return this._options;
	}

	/**
	 * The HTTP status code returned by Twitch for the request.
	 */
	get httpStatus(): number {
		return this._httpStatus;
	}

	/**
	 * The ID of the user that was used for authentication, or `null` if an app access token was used.
	 */
	get resolvedUserId(): string | null {
		return this._resolvedUserId;
	}
}
