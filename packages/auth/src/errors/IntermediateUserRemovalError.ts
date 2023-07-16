import { CustomError } from '@twurple/common';

/**
 * Thrown whenever a user is removed from an {@link AuthProvider}
 * and at the same time you try to execute an action in that user's context.
 */
export class IntermediateUserRemovalError extends CustomError {
	constructor(public readonly userId: string) {
		super(`User ${userId} was removed while trying to fetch a token.

Make sure you're not executing any actions when you want to remove a user.`);
	}
}
