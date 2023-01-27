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
