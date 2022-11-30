import { mapOptional } from '@d-fischer/shared-utils';
import { extractUserId, type UserIdResolvable } from '@twurple/common';

export function createBroadcasterQuery(user?: UserIdResolvable): Record<string, string | undefined> {
	return {
		broadcaster_id: mapOptional(user, extractUserId)
	};
}
