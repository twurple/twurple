import { CustomError } from '@twurple/common';

/**
 * Thrown whenever you try to execute an action in the context of a user
 * who is already known to have an invalid token saved in its {@link AuthProvider}.
 */
export class CachedRefreshFailureError extends CustomError {
	constructor(public readonly userId: string) {
		super(`The user context for the user ${userId} has been disabled.
This happened because the access token became invalid (e.g. by expiry) and refreshing it failed (e.g. because the account's password was changed).

Use .addUser(), .addUserForToken() or .addUserForCode() for the same user context to re-enable the user with a new, valid token.`);
	}
}
