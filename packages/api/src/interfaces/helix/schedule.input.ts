import { type HelixForwardPagination } from '../../api/helix/HelixPagination';
import { type HelixSchedule } from '../../api/helix/schedule/HelixSchedule';

/**
 * Filters for the schedule request.
 */
export interface HelixScheduleFilter {
	/**
	 * The earliest date to find schedule segments for.
	 */
	startDate?: string;

	/**
	 * The offset from UTC you request for, to ensure everything goes to the correct day.
	 */
	utcOffset?: number;
}

/**
 * @inheritDoc
 */
export interface HelixPaginatedScheduleFilter extends HelixScheduleFilter, HelixForwardPagination {}

/**
 * The result of a schedule request.
 */
export interface HelixPaginatedScheduleResult {
	/**
	 * The actual schedule object.
	 */
	data: HelixSchedule;

	/**
	 * The pagination cursor.
	 */
	cursor?: string;
}

/**
 * Vacation mode settings to update using {@link HelixScheduleApi#updateScheduleSettings}}.
 */
interface HelixScheduleSettingsUpdateVacation {
	/**
	 * The date when the vacation will start.
	 */
	startDate: string;

	/**
	 * The date when the vacation will end.
	 */
	endDate: string;

	/**
	 * The timezone for the given dates.
	 */
	timezone: string;
}

/**
 * Schedule settings to update using {@link HelixScheduleApi#updateScheduleSettings}}.
 */
export interface HelixScheduleSettingsUpdate {
	/**
	 * Vacation mode settings.
	 *
	 * Note that not setting this (or setting it to undefined) does not change the vacation settings, but setting it to null disables vacation mode.
	 */
	vacation?: HelixScheduleSettingsUpdateVacation | null;
}

/**
 * The data required to create a schedule segment.
 */
export interface HelixCreateScheduleSegmentData {
	/**
	 * The date when the segment starts. Must be in UTC.
	 */
	startDate: string;

	/**
	 * The timezone the segment is created from.
	 *
	 * This is used for managing DST shifts only. The `startDate` must always be given in UTC.
	 */
	timezone: string;

	/**
	 * Whether the segment is recurring every week.
	 */
	isRecurring: boolean;

	/**
	 * The planned duration of the segment, in minutes. Defaults to 240 (4 hours).
	 */
	duration?: number;

	/**
	 * The ID of the category of the segment.
	 */
	categoryId?: string;

	/**
	 * The title of the segment.
	 */
	title?: string;
}

/**
 * The data required to update a schedule segment.
 */
export interface HelixUpdateScheduleSegmentData {
	/**
	 * The date when the segment starts. Must be in UTC.
	 */
	startDate?: string;

	/**
	 * The timezone the segment is created from.
	 *
	 * This is used for managing DST shifts only. The `startDate` must always be given in UTC.
	 */
	timezone?: string;

	/**
	 * The planned duration of the segment, in minutes. Defaults to 240 (4 hours).
	 */
	duration?: number;

	/**
	 * The ID of the category of the segment.
	 */
	categoryId?: string;

	/**
	 * The title of the segment.
	 */
	title?: string;

	/**
	 * Whether the schedule broadcast is canceled.
	 */
	isCanceled?: boolean;
}
