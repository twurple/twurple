import { extractUserId, type UserIdResolvable } from '@twurple/common';
import {
	type HelixCreateScheduleSegmentData,
	type HelixScheduleFilter,
	type HelixScheduleSettingsUpdate,
	type HelixUpdateScheduleSegmentData,
} from './schedule.input';

/** @private */
export interface HelixScheduleVacationData {
	start_time: string;
	end_time: string;
}

/** @private */
export interface HelixScheduleSegmentCategoryData {
	id: string;
	name: string;
}

/** @private */
export interface HelixScheduleSegmentData {
	id: string;
	start_time: string;
	end_time: string;
	title: string;
	canceled_until: string | null;
	category: HelixScheduleSegmentCategoryData | null;
	is_recurring: boolean;
}

/** @private */
export interface HelixScheduleData {
	segments: HelixScheduleSegmentData[] | null;
	broadcaster_id: string;
	broadcaster_name: string;
	broadcaster_login: string;
	vacation: HelixScheduleVacationData | null;
}

/** @private */
export interface HelixScheduleResponse {
	data: HelixScheduleData;
	pagination: {
		cursor?: string;
	};
}

/** @internal */
export function createScheduleQuery(broadcaster: UserIdResolvable, filter?: HelixScheduleFilter) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		start_time: filter?.startDate,
		utc_offset: filter?.utcOffset?.toString(),
	};
}

/** @internal */
export function createScheduleSettingsUpdateQuery(
	broadcaster: UserIdResolvable,
	settings: HelixScheduleSettingsUpdate,
) {
	if (settings.vacation) {
		return {
			broadcaster_id: extractUserId(broadcaster),
			is_vacation_enabled: 'true',
			vacation_start_time: settings.vacation.startDate,
			vacation_end_time: settings.vacation.endDate,
			timezone: settings.vacation.timezone,
		};
	}
	return {
		broadcaster_id: extractUserId(broadcaster),
		is_vacation_enabled: 'false',
	};
}

/** @internal */
export function createScheduleSegmentBody(data: HelixCreateScheduleSegmentData) {
	return {
		start_time: data.startDate,
		timezone: data.timezone,
		is_recurring: data.isRecurring,
		duration: data.duration,
		category_id: data.categoryId,
		title: data.title,
	};
}

/** @internal */
export function createScheduleSegmentModifyQuery(broadcaster: UserIdResolvable, segmentId: string) {
	return {
		broadcaster_id: extractUserId(broadcaster),
		id: segmentId,
	};
}

/** @internal */
export function createScheduleSegmentUpdateBody(data: HelixUpdateScheduleSegmentData) {
	return {
		start_time: data.startDate,
		timezone: data.timezone,
		is_canceled: data.isCanceled,
		duration: data.duration,
		category_id: data.categoryId,
		title: data.title,
	};
}
