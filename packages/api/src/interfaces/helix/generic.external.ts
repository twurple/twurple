import { extractUserId, type UserIdResolvable } from '@twurple/common';

/** @private */
export function createSingleKeyQuery(
	key: string,
	value: string | string[] | undefined
): Record<string, string | string[] | undefined> {
	return { [key]: value };
}

/** @private */
export function createModeratorActionQuery(broadcaster: UserIdResolvable, moderator: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		moderator_id: extractUserId(moderator)
	};
}

/** @private */
export function createGetByIdsQuery(broadcaster: UserIdResolvable, rewardIds: string[]) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		id: rewardIds
	};
}

/** @private */
export interface HelixUserRelationData {
	user_id: string;
	user_login: string;
	user_name: string;
}

/** @private */
export function createChannelUsersCheckQuery(broadcaster: UserIdResolvable, users: UserIdResolvable[]) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		user_id: users.map(extractUserId)
	};
}

/** @private */
export interface HelixDateRangeData {
	started_at: string;
	ended_at: string;
}

/** @private */
export interface HelixEventData<T, EventType extends string = string> {
	id: string;
	event_type: EventType;
	event_timestamp: string;
	version: string;
	event_data: T;
}
