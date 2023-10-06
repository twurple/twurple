import { extractUserId, type UserIdResolvable } from '@twurple/common';

export function createBroadcasterQuery(user: UserIdResolvable): Record<string, string> {
	return {
		broadcaster_id: extractUserId(user),
	};
}
