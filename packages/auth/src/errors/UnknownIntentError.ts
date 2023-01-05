import { CustomError } from '@twurple/common';

/**
 * Thrown when an intent is requested that was not recognized by the {@link AuthProvider}.
 */
export class UnknownIntentError extends CustomError {
	/**
	 * The intent that was requested.
	 */
	readonly intent: string;

	/** @private */
	constructor(intent: string) {
		super(`Unknown intent: ${intent}`);

		this.intent = intent;
	}
}
