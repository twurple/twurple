import { extractUserId, type UserIdResolvable } from '@twurple/common';

/** @private */
export interface HelixSharedChatSessionParticipantData {
	broadcaster_id: string;
}

/** @private */
export interface HelixSharedChatSessionData {
	session_id: string;
	host_broadcaster_id: string;
	participants: HelixSharedChatSessionParticipantData[];
	created_at: string;
	updated_at: string;
}

/** @internal */
export function createSharedChatSessionQuery(broadcaster: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
	};
}
