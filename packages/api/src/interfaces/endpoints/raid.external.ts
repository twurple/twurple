import { extractUserId, type UserIdResolvable } from '@twurple/common';

/** @private */
export interface HelixRaidData {
	created_at: string;
	is_mature: boolean;
}

/** @internal */
export function createRaidStartQuery(from: UserIdResolvable, to: UserIdResolvable) {
	return {
		from_broadcaster_id: extractUserId(from),
		to_broadcaster_id: extractUserId(to),
	};
}
