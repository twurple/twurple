import { CustomError } from './CustomError.js';

/**
 * These are the kind of errors that should never happen.
 *
 * If you see one thrown, please file a bug in the GitHub issue tracker.
 */
export class HellFreezesOverError extends CustomError {
	constructor(message: string) {
		super(`${message} - this should never happen, please file a bug in the GitHub issue tracker`);
	}
}
