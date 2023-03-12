import { CustomError } from '@twurple/common';

export class IntermediateUserRemovalError extends CustomError {
	constructor(userId: string) {
		super(`User ${userId} was removed while trying to fetch a token.

Make sure you're not executing any actions when you want to remove a user.`);
	}
}
