import type { UserIdResolvable } from '@twurple/common';
import { extractUserId } from '@twurple/common';
import { BaseApi } from '../../BaseApi';
import type { HelixForwardPagination } from '../HelixPagination';
import { makePaginationQuery } from '../HelixPagination';
import { HelixPaginatedScheduleSegmentRequest } from './HelixPaginatedScheduleSegmentRequest';
import type { HelixScheduleResponse } from './HelixSchedule';
import { HelixSchedule } from './HelixSchedule';
import { HelixScheduleSegment } from './HelixScheduleSegment';

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
 * Vacation mode settings to update using {@HelixScheduleApi#updateScheduleSettings}.
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
 * Schedule settings to update using {@HelixScheduleApi#updateScheduleSettings}.
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

/**
 * The Helix API methods that deal with schedules.
 */
export class HelixScheduleApi extends BaseApi {
	/**
	 * Retrieves the schedule for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the schedule of.
	 * @param filter
	 *
	 * @expandParams
	 */
	async getSchedule(
		broadcaster: UserIdResolvable,
		filter?: HelixPaginatedScheduleFilter
	): Promise<HelixPaginatedScheduleResult> {
		const result = await this._client.callApi<HelixScheduleResponse>({
			type: 'helix',
			url: 'schedule',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				start_time: filter?.startDate,
				utc_offset: filter?.utcOffset?.toString(),
				...makePaginationQuery(filter)
			}
		});

		return {
			data: new HelixSchedule(result.data, this._client),
			cursor: result.pagination.cursor
		};
	}

	/**
	 * Creates a paginator for schedule segments for a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to get the schedule segments of.
	 * @param filter
	 *
	 * @expandParams
	 */
	getScheduleSegmentsPaginated(
		broadcaster: UserIdResolvable,
		filter?: HelixScheduleFilter
	): HelixPaginatedScheduleSegmentRequest {
		return new HelixPaginatedScheduleSegmentRequest(broadcaster, this._client, filter);
	}

	/**
	 * Retrieves a set of schedule segments by IDs.
	 *
	 * @param broadcaster The broadcaster to get schedule segments of.
	 * @param ids The IDs of the schedule segments.
	 */
	async getScheduleSegmentsByIds(broadcaster: UserIdResolvable, ids: string[]): Promise<HelixScheduleSegment[]> {
		const result = await this._client.callApi<HelixScheduleResponse>({
			type: 'helix',
			url: 'schedule',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				id: ids
			}
		});

		return result.data.segments.map(data => new HelixScheduleSegment(data, this._client));
	}

	/**
	 * Retrieves a single schedule segment by ID.
	 *
	 * @param broadcaster The broadcaster to get a schedule segment of.
	 * @param id The ID of the schedule segment.
	 */
	async getScheduleSegmentById(broadcaster: UserIdResolvable, id: string): Promise<HelixScheduleSegment | null> {
		const segments = await this.getScheduleSegmentsByIds(broadcaster, [id]);

		return segments.length ? segments[0] : null;
	}

	/**
	 * Retrieves the schedule for a given broadcaster in iCal format.
	 *
	 * @param broadcaster The broadcaster to get the schedule for.
	 */
	async getScheduleAsIcal(broadcaster: UserIdResolvable): Promise<string> {
		return await this._client.callApi<string>({
			type: 'helix',
			url: 'schedule/icalendar',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			}
		});
	}

	/**
	 * Updates the schedule settings of a given broadcaster.
	 *
	 * @param broadcaster The broadcaster to update the schedule settings for.
	 * @param settings
	 *
	 * @expandParams
	 */
	async updateScheduleSettings(broadcaster: UserIdResolvable, settings: HelixScheduleSettingsUpdate): Promise<void> {
		const vacationUpdateQuery: Record<string, string> = settings.vacation
			? {
					is_vacation_enabled: 'true',
					vacation_start_time: settings.vacation.startDate,
					vacation_end_time: settings.vacation.endDate,
					timezone: settings.vacation.timezone
			  }
			: {
					is_vacation_enabled: 'false'
			  };
		await this._client.callApi({
			type: 'helix',
			url: 'schedule/settings',
			method: 'PATCH',
			scope: 'channel:manage:schedule',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				...vacationUpdateQuery
			}
		});
	}

	/**
	 * Creates a new segment in a given broadcaster's schedule.
	 *
	 * @param broadcaster The broadcaster to create a new schedule segment for.
	 * @param data
	 *
	 * @expandParams
	 */
	async createScheduleSegment(
		broadcaster: UserIdResolvable,
		data: HelixCreateScheduleSegmentData
	): Promise<HelixScheduleSegment> {
		const result = await this._client.callApi<HelixScheduleResponse>({
			type: 'helix',
			url: 'schedule/segment',
			method: 'POST',
			scope: 'channel:manage:schedule',
			query: {
				broadcaster_id: extractUserId(broadcaster)
			},
			jsonBody: {
				start_time: data.startDate,
				timezone: data.timezone,
				is_recurring: data.isRecurring,
				duration: data.duration,
				category_id: data.categoryId,
				title: data.title
			}
		});

		return new HelixScheduleSegment(result.data.segments[0], this._client);
	}

	/**
	 * Updates a segment in a given broadcaster's schedule.
	 *
	 * @param broadcaster The broadcaster to create a new schedule segment for.
	 * @param segmentId The ID of the segment to update.
	 * @param data
	 *
	 * @expandParams
	 */
	async updateScheduleSegment(
		broadcaster: UserIdResolvable,
		segmentId: string,
		data: HelixUpdateScheduleSegmentData
	): Promise<HelixScheduleSegment> {
		const result = await this._client.callApi<HelixScheduleResponse>({
			type: 'helix',
			url: 'schedule/segment',
			method: 'PATCH',
			scope: 'channel:manage:schedule',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				id: segmentId
			},
			jsonBody: {
				start_time: data.startDate,
				timezone: data.timezone,
				is_canceled: data.isCanceled,
				duration: data.duration,
				category_id: data.categoryId,
				title: data.title
			}
		});

		return new HelixScheduleSegment(result.data.segments[0], this._client);
	}

	/**
	 * Deletes a segment in a given broadcaster's schedule.
	 *
	 * @param broadcaster The broadcaster to create a new schedule segment for.
	 * @param segmentId The ID of the segment to update.
	 */
	async deleteScheduleSegment(broadcaster: UserIdResolvable, segmentId: string): Promise<void> {
		await this._client.callApi<HelixScheduleResponse>({
			type: 'helix',
			url: 'schedule/segment',
			method: 'DELETE',
			scope: 'channel:manage:schedule',
			query: {
				broadcaster_id: extractUserId(broadcaster),
				id: segmentId
			}
		});
	}
}
