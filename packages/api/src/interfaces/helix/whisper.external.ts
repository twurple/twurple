import { extractUserId, type UserIdResolvable } from '@twurple/common';

/** @private */
export function createWhisperQuery(from: UserIdResolvable, to: UserIdResolvable) {
	return {
		from_user_id: extractUserId(from),
		to_user_id: extractUserId(to)
	};
}
