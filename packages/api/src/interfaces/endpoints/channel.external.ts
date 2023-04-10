import { mapOptional } from '@d-fischer/shared-utils';
import { type CommercialLength, extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixChannelUpdate } from './channel.input';

/** @private */
export interface HelixChannelData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	broadcaster_language: string;
	game_id: string;
	game_name: string;
	title: string;
	delay: number;
	tags: string[];
}

/** @private */
export interface HelixChannelEditorData {
	user_id: string;
	user_name: string;
	created_at: string;
}

/** @private */
export interface HelixChannelReferenceData {
	broadcaster_id: string;
	broadcaster_name: string;
	game_id: string;
	game_name: string;
	title: string;
}

/** @private */
export interface HelixFollowedChannelData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	followed_at: string;
}

/** @private */
export interface HelixChannelFollowerData {
	user_id: string;
	user_login: string;
	user_name: string;
	followed_at: string;
}

/** @private */
export function createChannelUpdateBody(data: HelixChannelUpdate) {
	return {
		game_id: data.gameId,
		broadcaster_language: data.language,
		title: data.title,
		delay: data.delay?.toString(),
		tags: data.tags
	};
}

/** @private */
export function createChannelCommercialBody(broadcaster: UserIdResolvable, length: CommercialLength) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		length: length
	};
}

/** @private */
export function createChannelVipUpdateQuery(broadcaster: UserIdResolvable, user: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		user_id: extractUserId(user)
	};
}

/** @private */
export function createChannelFollowerQuery(broadcaster: UserIdResolvable, user?: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		user_id: mapOptional(user, extractUserId)
	};
}

/** @private */
export function createFollowedChannelQuery(user: UserIdResolvable, broadcaster?: UserIdResolvable) {
	return {
		broadcaster_id: mapOptional(broadcaster, extractUserId),
		user_id: extractUserId(user)
	};
}
