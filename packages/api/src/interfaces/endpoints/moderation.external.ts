import { extractUserId, type UserIdResolvable } from '@twurple/common';
import { type HelixAutoModSettings } from '../../endpoints/moderation/HelixAutoModSettings';
import {
	type HelixBanFilter,
	type HelixBanUserRequest,
	type HelixCheckAutoModStatusData,
	type HelixModeratorFilter,
} from './moderation.input';

/**
 * Status of an unban request.
 */
export type HelixUnbanRequestStatus = 'pending' | 'approved' | 'denied' | 'acknowledged' | 'canceled';

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
export interface HelixModeratedChannelData {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
}

/** @private */
export interface HelixShieldModeStatusData {
	is_active: boolean;
	moderator_id: string;
	moderator_login: string;
	moderator_name: string;
	last_activated_at: string;
}

/** @private */
export interface HelixUnbanRequestData extends HelixModeratedChannelData {
	id: string;
	moderator_id: string;
	moderator_login: string;
	moderator_name: string;
	user_id: string;
	user_login: string;
	user_name: string;
	text: string;
	status: HelixUnbanRequestStatus;
	created_at: string;
	resolution_text: string | null;
	resolved_at: string | null;
}

/** @private */
export interface HelixWarningData {
	broadcaster_id: string;
	moderator_id: string;
	user_id: string;
	reason: string;
}

/** @internal */
export function createModerationUserListQuery(
	channel: UserIdResolvable,
	filter?: HelixModeratorFilter | HelixBanFilter,
) {
	return {
		broadcaster_id: extractUserId(channel),
		user_id: filter?.userId,
	};
}

/** @internal */
export function createModeratorModifyQuery(broadcaster: UserIdResolvable, user: UserIdResolvable) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		user_id: extractUserId(user),
	};
}

/** @internal */
export function createResolveUnbanRequestQuery(
	broadcaster: UserIdResolvable,
	moderator: UserIdResolvable,
	unbanRequestId: string,
	approved: boolean,
	resolutionMessage?: string,
) {
	return {
		unban_request_id: unbanRequestId,
		broadcaster_id: extractUserId(broadcaster),
		moderator_id: extractUserId(moderator),
		status: approved ? 'approved' : 'denied',
		resolution_text: resolutionMessage,
	};
}

/** @internal */
export function createAutoModProcessBody(user: UserIdResolvable, msgId: string, allow: boolean) {
	return {
		user_id: extractUserId(user),
		msg_id: msgId,
		action: allow ? 'ALLOW' : 'DENY',
	};
}

/** @internal */
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
		swearing: data.swearing,
	};
}

/** @internal */
export function createBanUserBody(data: HelixBanUserRequest) {
	return {
		data: {
			duration: data.duration,
			reason: data.reason,
			user_id: extractUserId(data.user),
		},
	};
}

/** @internal */
export function createUpdateShieldModeStatusBody(activate: boolean) {
	return {
		is_active: activate,
	};
}

/** @internal */
export function createCheckAutoModStatusBody(data: HelixCheckAutoModStatusData[]) {
	return {
		data: data.map(entry => ({
			msg_id: entry.messageId,
			msg_text: entry.messageText,
		})),
	};
}

/** @internal */
export function createWarnUserBody(user: UserIdResolvable, reason: string) {
	return {
		data: {
			user_id: extractUserId(user),
			reason,
		},
	};
}
