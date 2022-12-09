import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixAutoModSettings } from '../../api/helix/moderation/HelixAutoModSettings';
import { type HelixBanFilter, type HelixBanUserRequest } from './moderation.input';

/** @private */
export interface HelixAutoModSettingsData {
	broadcaster_id: string;
	moderator_id: string;
	overall_level: number | null;
	disability: number;
	aggression: number;
	sexuality_sex_or_gender: number;
	misogyny: number;
	bullying: number;
	swearing: number;
	race_ethnicity_or_religion: number;
	sex_based_terms: number;
}

/** @private */
export interface HelixAutoModStatusData {
	msg_id: string;
	is_permitted: boolean;
}

/** @private */
export interface HelixCommonBanUserData {
	user_id: string;
	moderator_id: string;
	created_at: string;
}

/** @private */
export interface HelixBanData extends HelixCommonBanUserData {
	user_login: string;
	user_name: string;
	moderator_login: string;
	moderator_name: string;
	expires_at: string;
	reason: string;
}

/** @private */
export interface HelixBanUserData extends HelixCommonBanUserData {
	broadcaster_id: string;
	end_time: string | null;
}

/** @private */
export interface HelixBlockedTermData {
	broadcaster_id: string;
	created_at: string;
	expires_at: string;
	id: string;
	moderator_id: string;
	text: string;
	updated_at: string;
}

/** @private */
export interface HelixModeratorData {
	user_id: string;
	user_login: string;
	user_name: string;
}

/** @private */
export function createModerationUserListQuery(channel: UserIdResolvable, filter?: HelixBanFilter) {
	return {
		broadcaster_id: extractUserId(channel),
		user_id: filter?.userId
	};
}

/** @private */
export function createModeratorModifyQuery(broadcaster: UserIdResolvable, user: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		user_id: extractUserId(user)
	};
}

/** @private */
export function createAutoModProcessBody(user: UserIdResolvable, msgId: string, allow: boolean) {
	return {
		user_id: extractUserId(user),
		msg_id: msgId,
		action: allow ? 'ALLOW' : 'DENY'
	};
}

/** @private */
export function createAutoModSettingsBody(data: HelixAutoModSettings) {
	return {
		overall_level: data.overallLevel,
		aggression: data.aggression,
		bullying: data.bullying,
		disability: data.disability,
		misogyny: data.misogyny,
		race_ethnicity_or_religion: data.raceEthnicityOrReligion,
		sex_based_terms: data.sexBasedTerms,
		sexuality_sex_or_gender: data.sexualitySexOrGender,
		swearing: data.swearing
	};
}

/** @private */
export function createBanUserBody(data: HelixBanUserRequest) {
	return {
		data: {
			duration: data.duration,
			reason: data.reason,
			user_id: extractUserId(data.userId)
		}
	};
}
