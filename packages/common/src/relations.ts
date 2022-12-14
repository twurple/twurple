import { RelationAssertionError } from './errors/RelationAssertionError';

/** @private */
export function checkRelationAssertion<T>(value: T | null): T {
	if (value == null) {
		throw new RelationAssertionError();
	}

	return value;
}
