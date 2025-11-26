import { mapOptional } from '@d-fischer/shared-utils';
import { type CommercialLength, extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixChannelUpdate } from './channel.input.js';

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
	content_classification_labels: string[];
	is_branded_content: boolean;
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
export interface HelixAdScheduleData {
	snooze_count: number;
	snooze_refresh_at: number;
	next_ad_at: number;
	duration: number;
	last_ad_at: number;
	preroll_free_time: number;
}

/** @private */
export interface HelixSnoozeNextAdData {
	snooze_count: number;
	snooze_refresh_at: number;
	next_ad_at: number;
}

/** @internal */
export function createChannelUpdateBody(data: HelixChannelUpdate) {
	return {
		game_id: data.gameId,
		broadcaster_language: data.language,
		title: data.title,
		delay: data.delay?.toString(),
		tags: data.tags,
		content_classification_labels: data.contentClassificationLabels,
		is_branded_content: data.isBrandedContent,
	};
}

/** @internal */
export function createChannelCommercialBody(broadcaster: UserIdResolvable, length: CommercialLength) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		length,
	};
}

/** @internal */
export function createChannelVipUpdateQuery(broadcaster: UserIdResolvable, user: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		user_id: extractUserId(user),
	};
}

/** @internal */
export function createChannelFollowerQuery(broadcaster: UserIdResolvable, user?: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		user_id: mapOptional(user, extractUserId),
	};
}

/** @internal */
export function createFollowedChannelQuery(user: UserIdResolvable, broadcaster?: UserIdResolvable) {
	return {
		broadcaster_id: mapOptional(broadcaster, extractUserId),
		user_id: extractUserId(user),
	};
}
