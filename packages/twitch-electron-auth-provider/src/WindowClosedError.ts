/**
 * Error produced when the user closes the authorization window before logging into Twitch.
 */
export default class WindowClosedError extends Error {
	constructor() {
		super('Window was closed');
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
