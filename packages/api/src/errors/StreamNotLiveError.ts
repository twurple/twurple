import { CustomError } from '@twurple/common';

/**
 * Thrown whenever you try something that requires your own stream to be live.
 */
export class StreamNotLiveError extends CustomError {
	/** @private */
	constructor(options?: ErrorOptions) {
		super('Your stream needs to be live to do this', options);
	}
}
