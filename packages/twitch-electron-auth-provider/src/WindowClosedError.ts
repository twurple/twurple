/**
 * Error produced when the user closes the authorization window before logging into Twitch.
 */
export class WindowClosedError extends Error {
	constructor() {
		super('Window was closed');
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
