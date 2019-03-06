import CustomError from './CustomError';

/**
 * Thrown whenever you try something that requires your own stream to be live.
 */
export default class StreamNotLiveError extends CustomError {
	constructor() {
		super('Your stream needs to be live to do this');
	}
}
