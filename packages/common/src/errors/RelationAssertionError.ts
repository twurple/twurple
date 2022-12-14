import { CustomError } from './CustomError';

/**
 * Thrown when a relation that is expected to never be null does return null.
 */
export class RelationAssertionError extends CustomError {
	constructor() {
		super('Relation returned null - this may be a library bug or a race condition in your own code');
	}
}
